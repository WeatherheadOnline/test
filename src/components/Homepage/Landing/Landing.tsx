import LoginForm from "@/components/Login/Login"
import './landing.css'
import LogoutButton from "@/components/LogoutButton/LogoutButton"

export default function Landing() {
    return (
<section className="page-section landing-section">
        <div className="landing-left-side">
          <p aria-hidden='true'>11100010101000100101110010111010100101111110001010100010010111001011101010010111111000101010001001011100101110101001011111100010101000100101110010111010100101111110001010100010010111001011101010010111</p></div>
          <div className="text-pattern-overlay"></div>
        <div className="landing-right-side">
          <div>
            <p className="landing-tagline"><span>Are you sick of</span><span>social media?</span></p>
            <h1><span>Just</span><span>A</span><span>Bit</span></h1>
            <p className="landing-tagline"><span>Post a zero or a one.</span><span>Then you're done.</span></p>
          </div>
          <LoginForm />
          <LogoutButton />
        </div>
      </section>
    )
}