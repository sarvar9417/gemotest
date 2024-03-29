import React from 'react'

export const DirectionTurn = ({section, room, turn}) => {

    return (
        <div className="kard" style={{ width: "90%", margin: "auto" }}>
            <div className="info" style={{ backgroundColor: "hsl(212, 86%, 64%)" }}>
                <h2 className="text px-2">{section}</h2>
                <p></p>
            </div>
            <div className="row">
                <div className="col-7" style={{ textAlign: "center", borderRight: "3px solid hsl(212, 86%, 64%)" }}>
                    <h5>Navbat</h5>
                    <h1 style={{ color: "green" }}>{turn}</h1>
                </div>
                <div className="col-4" style={{ textAlign: "center" }}>
                    <div className="image">
                        <h5>Xona</h5>
                           <h1 style={{ color: "#e3342f" }}>{room}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}
