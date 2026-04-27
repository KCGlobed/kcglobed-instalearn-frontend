import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyCart: React.FC = () => {
    return (
        <div className="text-center py-12 px-4 border border-gray-50 rounded bg-[#fbfcfc]">
            <ShoppingBag className="w-10 h-10 text-gray-100 mx-auto mb-3" />
            <p className="text-[14px] mb-4">Your cart is empty.</p>
            <Link to="/" className="inline-block bg-[#1c1d1f] text-white text-[13px] font-bold px-5 py-2 rounded">
                Browse Courses
            </Link>
        </div>
    );
};

export default EmptyCart;
