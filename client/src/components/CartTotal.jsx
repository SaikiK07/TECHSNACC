import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount } = useContext(ShopContext);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchSubtotal = async () => {
      const amount = await getCartAmount();
      setSubtotal(amount);
    };
    fetchSubtotal();
  }, [getCartAmount]);

  const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

  return (
    <div className='w-full'>
      <div className='text-2xl font-semibold mb-4'>
        <Title text1='CART' text2='TOTALS' />
      </div>
      <div className='space-y-4 text-sm text-gray-700'>

        <div className='flex justify-between'>
          <span className='font-medium'>Subtotal:</span>
          <span>{currency} {subtotal.toFixed(2)}</span>
        </div>

        <div className='flex justify-between'>
          <span className='font-medium'>Shipping Fee:</span>
          <span>{currency} {delivery_fee.toFixed(2)}</span>
        </div>

        <hr />

        <div className='flex justify-between text-base font-semibold'>
          <span>Total:</span>
          <span>{currency} {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
