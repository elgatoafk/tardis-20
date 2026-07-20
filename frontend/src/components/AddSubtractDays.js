import React, { useState } from 'react';
import axios from 'axios';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import '../styles/DarkMode.css';
import '../styles/TimeZoneSelector.css';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const DeltaURL = `${apiUrl}/user/add-subtract-timedelta`;

const AddSubtractDays = () => {
    const [datetime, setDatetime] = useState('');
    const [days, setDays] = useState(0);
    const [isAdd, setIsAdd] = useState(true);
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [copyMessage, setCopyMessage] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            datetime_str: datetime,
            timedelta_days: isAdd ? days : -days,
        };

        axios.post(DeltaURL, data)
            .then(response => {
                setResult(response.data);
                setErrorMessage('');
                setCopyMessage('');
                setIsCopied(false);
            })
            .catch(error => {
                if (error.response && error.response.data.detail) {
                    setErrorMessage(error.response.data.detail);
                } else {
                    setErrorMessage('An unexpected error occurred. Please try again.');
                }
                setResult(null);
            });
    };

    const handleCopyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(`Result: ${result.result}`).then(() => {
                setCopyMessage('Result copied to clipboard!');
                setIsCopied(true);
            }).catch(() => {
                setCopyMessage('Failed to copy result.');
                setIsCopied(false);
            });
        }
    };

    const toggleAddSubtract = () => {
        setIsAdd(!isAdd);
    };

    return (
        <div className="container my-4">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="left-panel p-3 rounded">
                        <h2>Enter date and time</h2>
                        <form id="main-form" onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <textarea
                                    id="main-form"
                                    className="form-control datetime-input"
                                    value={datetime}
                                    onChange={(e) => setDatetime(e.target.value)}
                                    placeholder="Waiting for input..."
                                    required
                                />
                            </div>
                            <div className="mb-3 d-flex justify-content-center align-items-center position-relative">
                                <button
                                    type="button"
                                    className="btn btn-primary toggle-button"
                                    onClick={toggleAddSubtract}
                                >
                                    {isAdd ? '+' : '-'}
                                </button>
                                <div className="info-icon-wrapper">
                                    <InfoOutlinedIcon className="info-icon" fontSize="medium" />
                                    <span className="info-text">Click to toggle between adding or subtracting days.</span>
                                </div>
                            </div>
                            <div className="mb-3 d-flex justify-content-center">
                                <input
                                    type="number"
                                    className="form-control"
                                    value={days}
                                    onChange={(e) => setDays(e.target.value)}
                                    placeholder="Enter number of days"
                                    required
                                />
                            </div>
                            <div className="d-flex justify-content-center">
                                <button type="submit" className="btn btn-primary submit-button">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    {errorMessage && (
                        <div className="alert alert-danger mt-4" role="alert">
                            {errorMessage}
                        </div>
                    )}
                    {result && (
                        <div
                            className={`result-container mt-4 p-3 rounded ${isCopied ? 'copied' : ''}`}
                            onClick={handleCopyToClipboard}
                            style={{ position: 'relative' }}
                        >
                            <h2>Result:</h2>
                            <p className="result-text">Result: {result.result}</p>
                            {copyMessage && <p className="copy-message">{copyMessage}</p>}
                            {/* Info Bubble */}
                            <div className="info-bubble" title="Click anywhere to copy the result to your clipboard">
                                <InfoOutlinedIcon />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddSubtractDays;
