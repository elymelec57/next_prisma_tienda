'use client'

import { useState, useEffect } from 'react';
import CartBusiness from '@/components/cartBusiness';

export default function RestaurantList() {
    const [dataRest, setDataRest] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch('/api/restaurants');
                const data = await res.json();
                setDataRest(data);
            } catch (error) {
                console.error('Failed to fetch restaurants:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className='flex flex-wrap justify-center space-x-2'>
            <CartBusiness restaurant={dataRest} />
        </div>
    );
}
