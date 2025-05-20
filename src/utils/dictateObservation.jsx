import axios from 'axios';
import callWithRetry from './callWithRetry';

export default async function dictateObservation(formData, onDownloadProgress) {
    const token = 'your token here'; // Replace with your actual token
    const endpoint = 'https://staging.corilus.cavell.app/api/v1/dictate-observation';

    const result = await callWithRetry(async () => {
        return await axios.post(
            endpoint,
            formData,
            { 
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                onDownloadProgress: onDownloadProgress
            },
            { 
                onDownloadProgress: onDownloadProgress
            }
        );
    });
    return result?.result;
}