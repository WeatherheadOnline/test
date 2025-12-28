import React from 'react'
import './feed.css'

const Feed = () => {

    const following = [
        {
            status: true,
            username: "Heidi789",
            flip_count: "100"
        },
        {
            status: true,
            username: "Hurgenburgen",
            flip_count: "200"
        },
        {
            status: false,
            username: "NotForHumanConsumption",
            flip_count: "400"
        },
        {
            status: false,
            username: "Snacktime120",
            flip_count: "300"
        },
    ]

    const cardsToDisplay = following.map((person) => {
        return (
            <article className="feed-card" key={person.username}>
                <p className="feed-bit">{person.status ? "1" : "0"}</p>
                <div className="feed-text">
                    <p className="feed-username">{person.username}</p>
                    <p className="feed-flip-count">Flipped {person.flip_count} bits</p>
                </div>
            </article>
        )
    })

    return (
    <section className='page-section'>
        <div className='section-wrapper'>
            <h2>What people are flipping</h2>
            <div className="feed-controls">
                <p>Checkbox: "only show people I'm following"</p>
                <p>Add fields for sort/filter/search</p>
            </div>
            <div className="feed-cards-wrapper">
                {cardsToDisplay}
            </div>

        </div>
    </section>
  )
}

export default Feed
