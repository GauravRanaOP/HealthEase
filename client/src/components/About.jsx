import React from "react";
import { Helmet } from "react-helmet-async";
// import { FaHeartbeat, FaUsers, FaPhoneAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeartbeat, faUsers, faPhoneAlt } from "@fortawesome/free-solid-svg-icons";

import aboutHeroImg200 from "../assets/images/about/about-hero-image_w_200.png";
import aboutHeroImg395 from "../assets/images/about/about-hero-image_w_395.png";
import aboutHeroImg538 from "../assets/images/about/about-hero-image_w_538.png";
import aboutHeroImg649 from "../assets/images/about/about-hero-image_w_649.png";
import aboutHeroImg757 from "../assets/images/about/about-hero-image_w_757.png";
import aboutHeroImg764 from "../assets/images/about/about-hero-image_w_764.png";
import aboutHeroImg988 from "../assets/images/about/about-hero-image_w_988.png";
import aboutHeroImg1012 from "../assets/images/about/about-hero-image_w_1012.png";
import aboutHeroImg1066 from "../assets/images/about/about-hero-image_w_1066.png";
import aboutHeroImg1080 from "../assets/images/about/about-hero-image_w_1080.png";

import "../assets/css/About.css";

export default function About () {
  return (
    <div className="about-page">
      <Helmet>
        <title>About Us | HealthEase</title>
        <meta
          name="description"
          content="Learn more about HealthEase, your trusted partner in healthcare, offering a wide range of diagnostic tests and health services."
        />
        <meta
          name="keywords"
          content="healthcare, diagnostic tests, health services, HealthEase"
        />
        <meta property="og:title" content="About Us | HealthEase" />
        <meta
          property="og:description"
          content="Learn more about HealthEase, your trusted partner in healthcare, offering a wide range of diagnostic tests and health services."
        />
        
      </Helmet>

      <div className="about-header">
        <h1>About Us</h1>
        <img 
          class="about-image"
          sizes="(max-width: 1080px) 100vw, 1080px"
          srcset={`
                  ${aboutHeroImg200} 200w,
                  ${aboutHeroImg395} 395w,
                  ${aboutHeroImg538} 538w,
                  ${aboutHeroImg649} 649w,
                  ${aboutHeroImg757} 757w,
                  ${aboutHeroImg764} 764w,
                  ${aboutHeroImg988} 988w,
                  ${aboutHeroImg1012} 1012w,
                  ${aboutHeroImg1066} 1066w,
                  ${aboutHeroImg1080} 1080w,
              `}
          src={`${aboutHeroImg1080}`}
          alt="A vector illustration of a hospital scene with doctors and nurses" 
        />

      </div>

      <p>
        Welcome to HealthEase, your trusted partner in healthcare. Our platform
        aims to provide easy access to diagnostic tests, healthcare
        professionals, and a wealth of health-related information. Whether
        you're looking for specific test centers, tracking your health data, or
        simply looking for advice, we're here to help.
      </p>

      <section className="mission">
        <h2>
          <FontAwesomeIcon icon={faHeartbeat} /> Our Mission
        </h2>
        <p>
          We strive to empower individuals to take control of their health by
          providing reliable information, easy access to diagnostic services,
          and promoting better health management.
        </p>
      </section>

      <section className="why-choose-us">
        <h2>
          <FontAwesomeIcon icon={faUsers} /> Why Choose Us?
        </h2>
        <ul>
          <li>
            Wide Range of Tests: We partner with trusted diagnostic centers to
            provide you with a variety of medical tests.
          </li>
          <li>
            Easy-to-Use Platform: Find diagnostic centers near you and book
            appointments in just a few clicks.
          </li>
          <li>
            Trusted and Reliable: We ensure that you have access to high-quality
            healthcare services.
          </li>
        </ul>
      </section>

      <section className="contact-us">
        <h2>
          <FontAwesomeIcon icon={faPhoneAlt} /> Contact Us
        </h2>
        <p>
          If you have any questions, feel free to contact us at{" "}
          <strong>support@healthease.com</strong>
        </p>
      </section>
      
    </div>
  );
};


