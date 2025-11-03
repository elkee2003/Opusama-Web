import React, { useEffect, useState } from 'react';
import './RealtorDashboard.css';
import { DataStore } from 'aws-amplify/datastore';
import { list, remove } from 'aws-amplify/storage';
import { deleteUser } from 'aws-amplify/auth';
import { Realtor, Post } from '../../../../../../../models';

function RealtorDashboard() {
    const [realtors, setRealtors] = useState([]);
    const [filteredRealtors, setFilteredRealtors] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingId, setLoadingId] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch Realtors
    const fetchRealtors = async () => {
        setLoading(true);
        try {
            const result = await DataStore.query(Realtor);

            // ✅ Sort by creation date: newest first
            const sorted = result.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

            setRealtors(sorted);
            setFilteredRealtors(sorted); 
        } catch (error) {
        console.error('Error fetching realtors:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRealtors();

        const subscription = DataStore.observe(Realtor).subscribe(() => fetchRealtors());
        return () => subscription.unsubscribe();
    }, []);
    
    // ✅ Refresh button handler
    const handleRefresh = () => {
        setRefreshing(true);
        fetchRealtors();
    };

    // ✅ Search Handler
    const handleSearch = (query) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredRealtors(realtors);
            return;
        }

        const lowercased = query.toLowerCase();
        const filtered = realtors.filter((realtor) => {
            const firstName = realtor?.firstName?.toLowerCase() || '';
            const lastName = realtor?.lastName?.toLowerCase() || '';
            const username = realtor?.username?.toLowerCase() || '';
            const phoneNumber = realtor?.phoneNumber?.toLowerCase() || '';
            return (
                firstName.includes(lowercased) ||
                lastName.includes(lowercased) ||
                username.includes(lowercased) ||
                phoneNumber.includes(lowercased)
            );
        });

        setFilteredRealtors(filtered);
    };

    // Note I am not sure if I am deleting from S3. Also I am not deleting communitypost discussion, replies, likes (everything community), post comment, post review, booking etc.

    // Delete all S3 media for a specific realtor
    const deleteRealtorMedia = async (realtorId) => {
        const folders = [
            `public/profilePhoto/${realtorId}/`,
            `public/media/${realtorId}/`,
            `public/qrCodes/${realtorId}/`
        ];

        for (const folder of folders) {
            try {
                let nextToken;
                do {
                    const result = await list({ path: folder, options: { listAll: true, nextToken } });
                    if (result?.items?.length) {
                        await Promise.all(result.items.map(file => remove({ path: file.path })));
                    }
                    nextToken = result.nextToken;
                } while (nextToken);
            } catch (error) {
                console.error(`Failed to delete folder ${folder}`, error);
            }
        }
    };

    // Delete all posts for a specific realtor
    const deleteRealtorPosts = async (realtorId) => {
        try {
        const posts = await DataStore.query(Post, p => p.realtorID.eq(realtorId));
        await Promise.all(posts.map(post => DataStore.delete(post)));
        } catch (error) {
        console.error('Failed to delete posts for realtor', error);
        }
    };

    // Delete a single realtor
    const handleDeleteRealtor = async (realtor) => {
        const confirmDelete = window.confirm(
        `Are you sure you want to delete realtor ${realtor.firstName} ${realtor.lastName}? This action cannot be undone.`
        );
        if (!confirmDelete) return;

        setLoadingId(realtor.id);

        try {
            // 1️⃣ Delete S3 media
            await deleteRealtorMedia(realtor.id);

            // 2️⃣ Delete all posts linked to the realtor
            await deleteRealtorPosts(realtor.id);

            // 3️⃣ Delete the realtor from DataStore
            await DataStore.delete(Realtor, r => r.id.eq(realtor.id));

            // 4️⃣ Delete the realtor from Cognito (if they have an account)
            await deleteUser();

            alert(`Realtor ${realtor.firstName} ${realtor.lastName} has been deleted successfully.`);
        } catch (error) {
            console.error('Error deleting realtor:', error);
            alert('Failed to delete realtor. Please try again.');
        } finally {
            setLoadingId(null);
        }
    };


    return (
        <div className="realtor-dashboard">
            <h2 className='realtor-dashboard-header'>
                Vendors
            </h2>

            {/* ✅ Search Input */}
            <input
                type="text"
                placeholder="Search by name, username, or phone number"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="realtor-search-input"
            />

            {/* ✅ Refresh Button */}
            <div className="refresh-container">
                <button onClick={handleRefresh} className="refresh-button">
                {refreshing ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* ✅ Realtor List */}
            {loading ? (
                <p>Loading Realtors...</p>
            ) : filteredRealtors.length === 0 ? (
                <p>No Realtors Found or No Matching Results</p>
            ) : (
                <div className="realtor-cards">
                {filteredRealtors.map((realtor) => (
                    <div key={realtor.id} className="realtor-card">
                        <p><strong>First Name:</strong> {realtor?.firstName}</p>
                        <p><strong>Last Name:</strong> {realtor?.lastName}</p>
                        <p><strong>Username:</strong> {realtor?.username}</p>
                        <p><strong>Phone Number:</strong> {realtor?.phoneNumber}</p>
                        <p><strong>Bank Name:</strong> {realtor?.bankName}</p>
                        <p><strong>Account Name:</strong> {realtor?.accountName}</p>
                        <p><strong>Account Number:</strong> {realtor?.accountNumber}</p>

                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteRealtor(realtor)}
                            disabled={loadingId === realtor.id}
                        >
                            {loadingId === realtor.id ? 'Deleting...' : 'Delete Realtor'}
                        </button>
                    </div>
                ))}
                </div>
            )}
        </div>
  );
}

export default RealtorDashboard;
