// UploadAddressPage.jsx (or whatever page renders the form)
import GoogleMapsProvider from
  '../../../../../../../Providers/ClientProvider/GoogleMapsProvider';
import GooglePlacesAutoCompleteCom from './Googleautocomplete';

const UploadAddressPage = () => {
  return (
    <GoogleMapsProvider>
      <GooglePlacesAutoCompleteCom />
    </GoogleMapsProvider>
  );
};

export default UploadAddressPage;
