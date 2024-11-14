import React from 'react'

const MonniPoint = () => {
    const payWithMonnify = () => {
        window.MonnifySDK.initialize({
            amount: 100,
            currency: "NGN",
            reference: String(new Date().getTime()),
            customerFullName: "John Doe",
            customerEmail: "johndoe@example.com",
            apiKey: "MK_TEST_2YB3EPGBBL",
            contractCode: "8167133407",
            paymentDescription: "Payment for services",
            metadata: { "name": "John", "age": 30 },
            onLoadStart: () => { console.log("loading has started"); },
            onLoadComplete: () => { console.log("SDK is UP"); },
            onComplete: (response) => {
                if (response.paymentStatus === "PAID") {
                    // Update your backend with the payment status 
                    // fetch('/api/update-payment-status', {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(response)
                    // }).then(res => res.json()).then(data => {
                    //     console.log('Payment status updated:', data);
                    // }).catch(error => {
                    //     console.error('Error updating payment status:', error);
                    // });
                    // Update the UI to show payment success 
                    alert('Payment Successful!');
                }
                else { alert('Payment Failed!'); }
            },
            onClose: (data) => {
                console.log(data);
                if (data.responseCode === "USER_CANCELLED") {
                    alert('Payment was cancelled by the user.');
                } else { alert('Payment process was closed.'); }
                // Handle the response when the user closes the payment modal } }); };
            }
        });
    };

    return (
        <div>
            <h1>Proceed to make payment</h1>
            <button onClick={payWithMonnify}>Pay With Monnify</button>
        </div>

    )
};
export default MonniPoint;