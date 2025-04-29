import React from "react";

const Connected = (props) => {
    // Add debug logging
    console.log("Connected props:", {
        account: props.account,
        candidates: props.candidates?.length || 0,
        remainingTime: props.remainingTime,
        showButton: props.showButton,
    });

    return (
        <div className="connected-container">
            <h1 className="connected-header">You are Connected to Metamask</h1>
            <p className="connected-account">
                Metamask Account: {props.account}
            </p>
            <p className="connected-account">
                Remaining Time: {props.remainingTime}
            </p>

            {/* This logic was reversed - showButton should show voting UI, not "already voted" */}
            {!props.showButton ? (
                <p className="connected-account">You have already voted</p>
            ) : (
                <div>
                    <input
                        type="number"
                        placeholder="Enter Candidate Index"
                        value={props.number}
                        onChange={props.handleNumberChange}
                    />
                    <br />
                    <button
                        className="login-button"
                        onClick={props.voteFunction}
                    >
                        Vote
                    </button>
                </div>
            )}

            <table id="myTable" className="candidates-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Candidate name</th>
                        <th>Candidate votes</th>
                    </tr>
                </thead>
                {console.log(props.candidates, "candidates")}
                <tbody>
                    {/* Add a check to prevent errors if candidates is undefined */}
                    {props.candidates && props.candidates.length > 0 ? (
                        props.candidates.map((candidate, index) => (
                            <tr key={index}>
                                <td>{candidate.index}</td>
                                <td>{candidate.name}</td>
                                <td>{candidate.voteCount}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">
                                No candidates available or still loading...
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Connected;
