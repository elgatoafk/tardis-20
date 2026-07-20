import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/TimeZoneSelector.css';
import '../styles/DarkMode.css';
import InfoIcon from '@mui/icons-material/Info';

const apiUrl = process.env.REACT_APP_API_BASE_URL;
const TZUrl = `${apiUrl}/user/timezones/`;
const DiffUrl = `${apiUrl}/user/get-difference`;

const TimeZoneSelector = () => {
    const [timezones, setTimezones] = useState([]);
    const [selectedTimezone, setSelectedTimezone] = useState('America/New_York');
    const [datetime, setDatetime] = useState('');
    const [result, setResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [copyMessage, setCopyMessage] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    useEffect(() => {
        axios.get(TZUrl)
            .then(response => {
                setTimezones(response.data.timezones);
            })
            .catch(error => console.error('Error fetching timezones:', error));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            datetime_str: datetime,
            timezone: selectedTimezone,
        };

        axios.post(DiffUrl, data)
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
            const textToCopy = `Calculated From: ${result.calculated_from}\nTime Difference: ${result.result}`;
            navigator.clipboard.writeText(textToCopy).then(() => {
                setCopyMessage('Result copied to clipboard!');
                setIsCopied(true);
            }).catch(() => {
                setCopyMessage('Failed to copy result.');
                setIsCopied(false);
            });
        }
    };

    return (
        <div className="container my-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="left-panel p-3 rounded">
                        <h2>Select Timezone</h2>
                        {timezones.map((tz) => (
                            <div key={tz} className="form-check">
                                <label className="form-check-label timezone-label" htmlFor={tz}>
                                    <input
                                        type="radio"
                                        className="form-check-input"
                                        id={tz}
                                        name="timezone"
                                        value={tz}
                                        checked={selectedTimezone === tz}
                                        onChange={(e) => setSelectedTimezone(e.target.value)}
                                    />
                                    {tz.split('/').pop().replace('_', ' ')}  {/* Display only the city name */}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="right-panel p-3 rounded">
                        <h2>Enter date and time</h2> {/* Match heading style */}
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
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
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
                    <h2>Result:</h2> {/* Match heading color */}
                    {result.future_warning && <p className="warning-text">Warning: The input datetime is in the future!
                        Thus, we calculated everything <b>from</b> your date.</p>}
                    <p className="result-text">Calculated with: {result.calculated_from}</p>
                    <p className="result-text">Time Difference: {result.result}</p>
                    {copyMessage && <p className="copy-message">{copyMessage}</p>}
                    {/* Info Bubble */}
                    <div className="info-bubble" title="Click anywhere to copy the result to your clipboard">
                        <InfoIcon />
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimeZoneSelector;
