import { Check } from '@material-ui/icons';
import React, { useState,useEffect } from 'react';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { useStateValue } from "./StateProvider";
import { Link, useHistory } from "react-router-dom";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CurrencyFormat from "react-currency-format";
import { getBasketTotal, getElement } from './reducer';
import axios from './axios';
import { db } from "./firebase";

function Payment() {
    const [{ basket, user }, dispatch] = useStateValue();
    const history = useHistory();
    const stripe = useStripe;
    const elements = useElements();
    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [processing, setProcessing] = useState("");
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState(true);

    useEffect(()=>{
        //whenever the basket changes it will stripe special secreate
        //charge the customer the correct amount 

         //generate the special stripe which allows us to 
         // charge a customer
        const getclientSecret = async ()=> {
            const response = await axios({
                method : 'post',
                //stripe expects the total in a curencies submit
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`

            });
            setClientSecret(response.data.clientSecret)

        }
        getclientSecret();

    }, [basket])

    console.log('the secret is >>>' , clientSecret)

    const handleSubmit = async (event) => {
        // do all the fancy stripe stuff...
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {
            // paymentIntent = payment confirmation

            db
              .collection('users')
              .doc(user?.uid)


              .collection('orders')
              .doc(paymentIntent.id)
              .set({
                  basket: basket,
                  amount: paymentIntent.amount,
                  created: paymentIntent.created
                })
             {/*theory
              20% quiz(4 quiz)
              3 exam (mid and end sem)(50%)
              assgn(20%)
              presen(10%)
              lab
              lab assgn (40%)
              project(40%)
              viva and presentation(20%)
              })
            */}
            setSucceeded(true);
            setError(null)
            setProcessing(false)

            dispatch({
                type: 'EMPTY_BASKET'
            })

            history.replace('/orders')
        })
    }
    const handleChange = event =>{
        //listen for changes in the cardelement 
        //and display any errors as the customer types their card detials
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }
    return (
        <div className='payment'>
            <div className='payment__container'>
                <h1>
                    Checkout (
                        
                        <Link to="/checkout">{basket?.length} items</Link>
                        )
                </h1>
                {/* payment section- delivery address*/}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Delivery Address</h3>
                    </div>
                    <div className='payment__address'>
                        <p>{user?.email}</p>
                        <p>123 react lane</p>
                        <p>los angeles, CA</p>
                    </div>
                </div>
                {/* payment section- review item*/}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3> Reviews items and delivery</h3>
                    </div>
                    <div className='payment__items'>
                        {basket.map(item => (
                            <CheckoutProduct
                                id={item.id}
                                title={item.title}
                                image={item.image}
                                price={item.price}
                                rating={item.rating}
                            />
                        ))}

                    </div>

                </div>
                {/* payment section- payment method*/}
                <div className='payment__section'>
                    <div className='payment__title'>
                        <h3>Payment Method</h3>
                    </div>
                    <div className='payment__details'>
                        {/* stripe magic */}
                        <form onSubmit={handleSubmit}>
                            <CardElement onChange={handleChange} />
                            <div className="payment__priceContainer">
                                <CurrencyFormat
                                    renderText={(value) => (
                                        <h3>Order Total: {value}</h3>
                    
                                    )}
                                    decimalScale={2}
                                    value={getBasketTotal(basket)}
                                    displayType={"text"}
                                    thousandSeprator={true}
                                    prefix={"$"}
                                />
                                <button disabled={processing || disabled ||succeeded}>
                                    <span>{processing ? <p>Processing</p> : "Buy Now" }</span>
                                </button>
                            </div>

                            {/* error */}
                            {error && <div>{error}</div>}
                        </form>

                    </div>
                </div>

            </div>

        </div>
    )
}

export default Payment
