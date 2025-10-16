import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import { DataStore } from 'aws-amplify/datastore';
import { list, remove } from 'aws-amplify/storage';
import { deleteUser } from 'aws-amplify/auth';
import { User } from '../../../../../../../models';

function UserDashboard() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingId, setLoadingId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // ✅ Fetch Users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const result = await DataStore.query(User);
            setUsers(result);
            setFilteredUsers(result); // ✅ Keep filtered list synced
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        const subscription = DataStore.observe(User).subscribe(() => fetchUsers());
        return () => subscription.unsubscribe();
    }, []);

    // ✅ Refresh Button Handler
    const handleRefresh = () => {
        setRefreshing(true);
        fetchUsers();
    };

    // ✅ Search Handler
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredUsers(users);
            return;
        }

        const lowercased = query.toLowerCase();
        const filtered = users.filter((user) => {
            const firstName = user?.firstName?.toLowerCase() || '';
            const lastName = user?.lastName?.toLowerCase() || '';
            const username = user?.username?.toLowerCase() || '';
            const phoneNumber = user?.phoneNumber?.toLowerCase() || '';
            return (
                firstName.includes(lowercased) ||
                lastName.includes(lowercased) ||
                username.includes(lowercased) ||
                phoneNumber.includes(lowercased)
            );
        });

        setFilteredUsers(filtered);
    };

    // Note I am not sure if I am deleting from S3. Also I am not deleting communitypost discussion, replies, likes (everything community), post comment, post review, booking etc.

    // ✅ Delete S3 media (if exists)
    const deleteUserMedia = async (userId) => {
        const folders = [
        `public/profilePhoto/${userId}/`,
        `public/qrCodes/${userId}/`,
        ];

        for (const folder of folders) {
        try {
            let nextToken;
            do {
            const result = await list({ prefix: folder, options: { listAll: true, nextToken } });
            if (result?.items?.length) {
                await Promise.all(result.items.map(file => remove({ key: file.key })));
            }
            nextToken = result.nextToken;
            } while (nextToken);
        } catch (error) {
            console.error(`Failed to delete folder ${folder}`, error);
        }
        }
    };

    // ✅ Call backend API to delete from Cognito
    const deleteFromCognito = async (username) => {
        try {
        await fetch(`${process.env.REACT_APP_API_BASE_URL}/delete-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }),
        });
        } catch (error) {
        console.error('Failed to delete user from Cognito:', error);
        }
    };

    // ✅ Delete a user completely
    const handleDeleteUser = async (user) => {
        const confirmDelete = window.confirm(
        `Are you sure you want to delete user ${user.firstName} ${user.lastName}? This cannot be undone.`
        );
        if (!confirmDelete) return;

        setLoadingId(user.id);

        try {
        // 1️⃣ Delete all S3 media
        await deleteUserMedia(user.id);

        // 2️⃣ Delete from Cognito (via backend)
        await deleteFromCognito(user.username);

        // 3️⃣ Delete from DataStore
        await DataStore.delete(User, u => u.id.eq(user.id));

        alert(`User ${user.firstName} ${user.lastName} has been deleted successfully.`);
        } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
        } finally {
        setLoadingId(null);
        }
    };


    return (
        <div className="user-dashboard">
            <h2 className='user-dashboard-header'>Users</h2>

            {/* ✅ Search Input */}
            <input
                type="text"
                placeholder="Search by name, username, or phone number"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="user-search-input"
            />

            {/* ✅ Refresh Button */}
            <div className="refresh-container">
                <button onClick={handleRefresh} className="refresh-button">
                    {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div> 

            {/* ✅ User List */}
            {loading ? (
                <p>Loading Users...</p>
            ) : filteredUsers.length === 0 ? (
                <p>No Users Found or No Matching Results</p>
            ) : (
                <div className="user-cards">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="user-card">
                            <p><strong>First Name:</strong> {user?.firstName}</p>
                            <p><strong>Last Name:</strong> {user?.lastName}</p>
                            <p><strong>Username:</strong> {user?.username}</p>
                            <p><strong>Phone Number:</strong> {user?.phoneNumber}</p>

                            {/* Delete Btn */}
                            <button
                                className="delete-btn"
                                onClick={() => handleDeleteUser(user)}
                                disabled={loadingId === user.id}
                            >
                                {loadingId === user.id ? 'Deleting...' : 'Delete User'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
  );
}

export default UserDashboard;
