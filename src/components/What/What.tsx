import './what.css'
import '@/styles/globals.css'

export default function Landing() {
    return (
        <section className="page-section what-section">
            <div className="section-wrapper">
                <div className='what-heading-wrapper'>
                    <h2>What?</h2>
                </div>
                <div className="what-paragraphs">
                    <div>
                        <article>
                            <p>
                                <span>Just A Bit</span><span>is an</span><span>anti-social</span><span>media</span><span>site.</span>
                            </p>
                        </article>
                    </div>
                    <div>
                        <article>
                            <p>
                                <span>No likes.</span><span>No reposts.</span>&nbsp;
                                <span>(But you can</span><span><span className="font monospace">follow</span> your friends</span><span>to see their bits.)</span>
                            </p>
                        </article>
                        <article>
                            <p>
                                <span>Posts have a</span>
                                <span>one-character limit</span>
                                <span>-- and a</span>
                                <span>one-bit limit.</span>
                            </p>
                        </article>
                        <article>
                            <p>
                                <span>Flip your bit</span>
                                <span>as often as you like.</span>&nbsp;
                                <span>Post a zero or a one.</span>
                                <span>Then you’re done.</span>
                            </p>
                        </article>
                    </div>
                </div>
            </div>
        </section>
    )
}