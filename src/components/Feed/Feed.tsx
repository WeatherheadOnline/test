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
        {
            status: true,
            username: "Heidi7892",
            flip_count: "100"
        },
        {
            status: true,
            username: "Hurgenburgen2",
            flip_count: "200"
        },
        {
            status: false,
            username: "NotForHumanConsumption2",
            flip_count: "400"
        },
        {
            status: false,
            username: "Snacktime1202",
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

    const sortAndFilter=()=>{}

// The return statement

    return (
    <section className='page-section'>
        <div className='section-wrapper'>
            <h2>What people are flipping</h2>
            <div className="feed-controls">
                <label>
                    <input type="checkbox"></input>
                    Only show people I'm following
                </label>
               <form onSubmit={sortAndFilter}>
                    <label htmlFor="sortOptions">Sort by:</label>
                    <div className="dropdowns-wrapper">
                        <select name="sortOptions" id="sortOptions">
                            <option value="">Please select...</option>
                            <option value="bitAscending">Bit (0 - 1)</option>
                            <option value="bitDescending">Bit (1 - 0)</option>
                            <option value="usernameAscending">Username (A - Z)</option>
                            <option value="usernameDescending">Username (Z - A)</option>
                            <option value="flipsDescending">Most flips</option>
                            <option value="flipsAscending">Least flips</option>
                        </select>
                    </div>
                    <button>Sort</button>
                    <p>(Add a filter)</p>
                    <button>Filter</button>
                </form>
            </div>
            <div className="feed-cards-wrapper">
                {cardsToDisplay}
            </div>

        </div>
    </section>
  )
}

export default Feed
