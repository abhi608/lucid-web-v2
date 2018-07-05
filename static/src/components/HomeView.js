import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Switch, Redirect} from 'react-router';

import * as actionCreators from '../actions/auth';

// var __html = require ('./index.html');
// var __html = '<p> do you know if this works </p>'
var __html = `
  <!--==========================
    Header
  ============================-->
  <header id="header">
    <div class="container-fluid">

      <div id="logo" class="pull-left">
        <h1><a href="#intro" class="scrollto">Lucid Law</a></h1>
        <!-- Uncomment below if you prefer to use an image logo -->
        <!-- <a href="#intro"><img src="src/components/img/logo.png" alt="" title="" /></a>-->
      </div>

      <nav id="nav-menu-container">
        <ul class="nav-menu">
          <li class="menu-active"><a href="#intro">Home</a></li>
          <li><a href="#about">About Us</a></li>
          <li><a href="#services">Features</a></li>
          <li><a href="#call-to-action">Call To Action</a></li>
          <li><a href="#team">Team</a></li>
          
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav><!-- #nav-menu-container -->
    </div>
  </header><!-- #header -->

  <!--==========================
    Intro Section
  ============================-->
  <section id="intro">
    <div class="intro-container">
      <div id="introCarousel" class="carousel  slide carousel-fade" data-ride="carousel">

        <ol class="carousel-indicators"></ol>

        <div class="carousel-inner" role="listbox">

          <div class="carousel-item active">
            <div class="carousel-background"><img src="src/components/img/intro-carousel/legal_research_1.jpg" alt=""></div>
            <div class="carousel-container">
              <div class="carousel-content">
                <h2>Legal Research, Made Simpler</h2>
                <p>Lucid Law is an online tool to aid legal research. Searching for relevant case law now takes minutes, not hours</p>
                <a href="/search" class="btn-get-started scrollto">Get Started</a>
              </div>
            </div>
          </div>


        </div>

        
      </div>
    </div>
  </section><!-- #intro -->

  <main id="main">

    <!--==========================
      Featured Services Section
    ============================-->
    <section id="featured-services">
      <div class="container">
        <div class="row">

          <div class="col-lg-4 box">
            <i class="ion-ios-bookmarks-outline"></i>
            <h4 class="title">Online Research</h4>
            <p class="description">Lucid Law allows you to search and organize legal documents online. No need for time consuming searches through offline journals.</p>
          </div>

          <div class="col-lg-4 box box-bg">
            <i class="ion-ios-search"></i>
            <h4 class="title">Read Less, Understand More</h4>
            <p class="description">Read static or adaptive summaries for each document to determine its relevance to your case, before reading it in full. Save your time and effort.</p>
          </div>

          <div class="col-lg-4 box">
            <i class="ion-code-working"></i>
            <h4 class="title">AI to the Rescue</h4>
            <p class="description">We make use of the latest developments in Artificial Intelligence and Deep Learning for intelligent searches, summaries and recommendations.</p>
          </div>

        </div>
      </div>
    </section><!-- #featured-services -->

    <!--==========================
      About Us Section
    ============================-->
    <section id="about">
      <div class="container">

        <header class="section-header">
          <h3>About The Product</h3>

          <p>The days of leafing through volumes of offline journals are over. And so are the days of online search databases that rely on exact word matches and don"t understand the meaning of your query. Lucid Law is built to assist legal research by making it more efficient, saving manual labour and time. It understands the case laws and your query, and uses it to deliver relevant search results and document summaries. Lucid Law is built to scale, and aims to do this and so much more by unleashing the power of deep learning judiciously. </p>

          <p>You can visit the beta version <a href="/search">here</a>. We actively seek suggestions for improvement and constructive feedback at this stage. This would enable us to build the next version such that it solves the problem effectively and is also delightful to use. </p>
        </header>

        <div class="row about-cols">

          <div class="col-md-4 wow fadeInUp">
            <div class="about-col">
              <div class="img">
                <img src="src/components/img/law_2.jpeg" alt="" class="img-fluid">
                <div class="icon"><i class="ion-ios-search"></i></div>
              </div>
              <h2 class="title">Intelligent Search</h2>
              <p>
                Gone are the days for searching by the word. Lucid Law enables fuzzy searching, autocomplete, paraphrase searching and more. Find the most relevant documents right where you want them - at the top of your search results. 
              </p>
            </div>
          </div>

          <div class="col-md-4 wow fadeInUp" data-wow-delay="0.1s">
            <div class="about-col">
              <div class="img">
                <img src="src/components/img/law_5.jpg" alt="" class="img-fluid">
                <div class="icon"><i class="ion-ios-list-outline"></i></div>
              </div>
              <h2 class="title">Case Summarization</h2>
              <p>
                We use state-of-the-art algorithms in Natural Language Processing to construct a summary for every case. Read the summary to determine relevance of the document, and click through it to visit the various segments of the case. 
              </p>
            </div>
          </div>

          <div class="col-md-4 wow fadeInUp" data-wow-delay="0.2s">
            <div class="about-col">
              <div class="img">
                <img src="src/components/img/law_books_1.jpg" alt="" class="img-fluid">
                <div class="icon"><i class="ion-android-create"></i></div>
              </div>
              <h2 class="title">Query Adaptive Brief</h2>
              <p>
                You have a document and you only want to see the sections that are relevant to your query? We can generate a summary of the case that adapts to the query. Spend time only in the parts of a case that you care about. 
              </p>
            </div>
          </div>

        </div>

      </div>
    </section><!-- #about -->

    <!--==========================
      Services Section
    ============================-->
    <section id="services">
      <div class="container">

        <header class="section-header wow fadeInUp">
          <h3>Further Features</h3>
          <p>Apart from the ones mentioned above, a legal researcher would be able to benefit from the following features in subsequent versions:</p>
        </header>

        <div class="row">

          <div class="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
            <div class="icon"><i class="ion-ios-browsers-outline"></i></div>
            <h4 class="title">Smart Recommendations</h4>
            <p class="description">Get content-based and user-based intelligent recommendations for each document that you open.</p>
          </div>
          <div class="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
            <div class="icon"><i class="ion-ios-analytics-outline"></i></div>
            <h4 class="title">Brief Analysis</h4>
            <p class="description">Upload a brief and get a detailed analysis of its quality, of the cases cited and their validity.</p>
          </div>
          <div class="col-lg-4 col-md-6 box wow bounceInUp" data-wow-duration="1.4s">
            <div class="icon"><i class="ion-ios-briefcase-outline"></i></div>
            <h4 class="title"><a href="">Document Organization</a></h4>
            <p class="description">Organize your bookmarked documents with all your highlights in a folder. Discipline is the key to efficiency. </p>
          </div>
          
        </div>

      </div>
    </section><!-- #services -->

    <!--==========================
      Call To Action Section
    ============================-->
    <section id="call-to-action" class="wow fadeIn">
      <div class="container text-center">
        <h3>Call To Action</h3>
        <p> Visit the web application to try our beta product. We need your valuable feedback and suggestions, so please don"t forget to voice your views. </p>
        <a class="cta-btn" href="/search">Visit Lucid Law</a>
      </div>
    </section><!-- #call-to-action -->

    
    <!--==========================
      Team Section
    ============================-->
    <section id="team">
      <div class="container">
        <div class="section-header wow fadeInUp">
          <h3>Team</h3>
          <!-- <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque</p> -->
        </div>

        <div class="row">

          <div class="col-lg-3 col-md-6 wow fadeInUp">
            <div class="member">
              <img src="src/components/img/team/kg.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Kanishk Gandhi</h4>
                  <span>Electrical Engineering graduate, IIT Kanpur</span>
                  <div class="social">
                    <a href=""><i class="fa fa-twitter"></i></a>
                    <a href=""><i class="fa fa-facebook"></i></a>
                    <a href=""><i class="fa fa-google-plus"></i></a>
                    <a href=""><i class="fa fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
            <div class="member">
              <img src="src/components/img/team/na.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Nishit Asnani</h4>
                  <span>Computer Science grad, IIT Kanpur</span>
                  <div class="social">
                    <a href=""><i class="fa fa-twitter"></i></a>
                    <a href=""><i class="fa fa-facebook"></i></a>
                    <a href=""><i class="fa fa-google-plus"></i></a>
                    <a href=""><i class="fa fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.2s">
            <div class="member">
              <img src="src/components/img/team/av.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Abhishek Verma</h4>
                  <span>Computer Science grad, IIT Kanpur</span>
                  <div class="social">
                    <a href=""><i class="fa fa-twitter"></i></a>
                    <a href=""><i class="fa fa-facebook"></i></a>
                    <a href=""><i class="fa fa-google-plus"></i></a>
                    <a href=""><i class="fa fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div class="member">
              <img src="src/components/img/team/am.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Maiti</h4>
                  <span>Physics grad, IIT Kanpur</span>
                  <div class="social">
                    <a href=""><i class="fa fa-twitter"></i></a>
                    <a href=""><i class="fa fa-facebook"></i></a>
                    <a href=""><i class="fa fa-google-plus"></i></a>
                    <a href=""><i class="fa fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-3 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
            <div class="member">
              <img src="src/components/img/team/sk.jpg" class="img-fluid" alt="">
              <div class="member-info">
                <div class="member-info-content">
                  <h4>Sayash Kapoor</h4>
                  <span>Computer Science, IIT Kanpur</span>
                  <div class="social">
                    <a href=""><i class="fa fa-twitter"></i></a>
                    <a href=""><i class="fa fa-facebook"></i></a>
                    <a href=""><i class="fa fa-google-plus"></i></a>
                    <a href=""><i class="fa fa-linkedin"></i></a>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section><!-- #team -->

    <!--==========================
      Contact Section
    ============================-->
    <section id="contact" class="section-bg wow fadeInUp">
      <div class="container">

        <div class="section-header">
          <h3>Contact Us</h3>
          <p>Reach out to us for feedback, suggestions, queries and everything else. We would be happy to talk to you. </p>
        </div>

        <div class="row contact-info">

          <div class="col-md-4">
            <div class="contact-address">
              <i class="ion-ios-location-outline"></i>
              <h3>Address</h3>
              <address>IIT Kanpur, Kanpur</address>
            </div>
          </div>

          <div class="col-md-4">
            <div class="contact-phone">
              <i class="ion-ios-telephone-outline"></i>
              <h3>Phone Number</h3>
              <p><a href="tel:+917755057761">+91 7755057761</a></p>
            </div>
          </div>

          <div class="col-md-4">
            <div class="contact-email">
              <i class="ion-ios-email-outline"></i>
              <h3>Email</h3>
              <p><a href="mailto:lucidlaw@gmail.com">lucidlaw@gmail.com</a></p>
            </div>
          </div>

        </div>

        <div class="form">
          <div id="sendmessage">Your message has been sent. Thank you!</div>
          <div id="errormessage"></div>
          <form action="" method="post" role="form" class="contactForm">
            <div class="form-row">
              <div class="form-group col-md-6">
                <input type="text" name="name" class="form-control" id="name" placeholder="Your Name" data-rule="minlen:4" data-msg="Please enter at least 4 chars" />
                <div class="validation"></div>
              </div>
              <div class="form-group col-md-6">
                <input type="email" class="form-control" name="email" id="email" placeholder="Your Email" data-rule="email" data-msg="Please enter a valid email" />
                <div class="validation"></div>
              </div>
            </div>
            <div class="form-group">
              <input type="text" class="form-control" name="subject" id="subject" placeholder="Subject" data-rule="minlen:4" data-msg="Please enter at least 8 chars of subject" />
              <div class="validation"></div>
            </div>
            <div class="form-group">
              <textarea class="form-control" name="message" rows="5" data-rule="required" data-msg="Please write something for us" placeholder="Message"></textarea>
              <div class="validation"></div>
            </div>
            <div class="text-center"><button type="submit">Send Message</button></div>
          </form>
        </div>

      </div>
    </section><!-- #contact -->

  </main>

  <!--==========================
    Footer
  ============================-->
  <footer id="footer">
    
    <div class="container">
      <div class="copyright">
        &copy; Copyright <strong>BizPage</strong>. All Rights Reserved
      </div>
      <div class="credits">
        <!--
          All the links in the footer should remain intact.
          You can delete the links only if you purchased the pro version.
          Licensing information: https://bootstrapmade.com/license/
          Purchase the pro version with working PHP/AJAX contact form: https://bootstrapmade.com/buy/?theme=BizPage
        -->
        Designed by <a href="https://bootstrapmade.com/">BootstrapMade</a>
      </div>
    </div>
  </footer><!-- #footer -->

  <a href="#" class="back-to-top"><i class="fa fa-chevron-up"></i></a>

  <!-- JavaScript Libraries -->
  <script src="src/components/lib/jquery/jquery.min.js"></script>
  <script src="src/components/lib/jquery/jquery-migrate.min.js"></script>
  <script src="src/components/lib/bootstrap/js/bootstrap.bundle.min.js"></script>
  <script src="src/components/lib/easing/easing.min.js"></script>
  <script src="src/components/lib/superfish/hoverIntent.js"></script>
  <script src="src/components/lib/superfish/superfish.min.js"></script>
  <script src="src/components/lib/wow/wow.min.js"></script>
  <script src="src/components/lib/waypoints/waypoints.min.js"></script>
  <script src="src/components/lib/counterup/counterup.min.js"></script>
  <script src="src/components/lib/owlcarousel/owl.carousel.min.js"></script>
  <script src="src/components/lib/isotope/isotope.pkgd.min.js"></script>
  <script src="src/components/lib/lightbox/js/lightbox.min.js"></script>
  <script src="src/components/lib/touchSwipe/jquery.touchSwipe.min.js"></script>
  <!-- Contact Form JavaScript File -->
  <script src="src/components/contactform/contactform.js"></script>

  <!-- Template Main Javascript File -->
  <script src="src/components/js/main.js"></script>
`

var template = { __html: __html };

function mapStateToProps(state) {
    return {
        isAuthenticating: state.auth.isAuthenticating,
        statusText: state.auth.statusText,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(actionCreators, dispatch);
}


const style = {
    marginTop: 50,
    paddingBottom: 50,
    paddingTop: 25,
    width: '100%',
    textAlign: 'center',
    display: 'inline-block',
};


@connect(mapStateToProps, mapDispatchToProps)
export default class HomeView extends React.Component {
    render(){
    	return(
		<div dangerouslySetInnerHTML={template} />
        );

    }
}
