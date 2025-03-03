import React from "react";

const About = () => {
  const policies = [
    {
      title: "Terms and Conditions",
      url: "https://merchant.razorpay.com/policy/PazJfIXmxY4p5t/terms",
    },
    {
      title: "Privacy Policy",
      url: "https://merchant.razorpay.com/policy/PazJfIXmxY4p5t/privacy",
    },
    {
      title: "Cancellations and Refunds",
      url: "https://merchant.razorpay.com/policy/PazJfIXmxY4p5t/refund",
    },
    {
      title: "Shipping Policy",
      url: "https://merchant.razorpay.com/policy/PazJfIXmxY4p5t/shipping",
    },
    {
      title: "Contact Us",
      url: "https://merchant.razorpay.com/policy/PazJfIXmxY4p5t/contact_us",
    },
  ];

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">About Us</h2>
      <p className="text-center text-muted">
        Learn more about our policies and terms of service.
      </p>

      <div className="row">
        {policies.map((policy, index) => (
          <div key={index} className="col-md-6 mb-4">
            <div className="card shadow-sm border-0">
              <div className="card-body text-center">
                <h5 className="card-title">{policy.title}</h5>
                <a
                  href={policy.url}
                  className="btn btn-primary mt-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
