import React from 'react';

function ATSScoreDisplay({ score, suggestions = [] }) {
    // Determine color based on score
    let color = '#8b0000'; // Red: 0-40 (Needs Work)
    let statusText = 'Needs Work';

    if (score >= 71) {
        color = '#4f6f52'; // Green: 71-100 (Strong Resume)
        statusText = 'Strong Resume';
    } else if (score >= 41) {
        color = '#c58b2b'; // Amber: 41-70 (Getting There)
        statusText = 'Getting There';
    }

    // SVG Circular Progress Math
    const radius = 46;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <div className="ats-score-display" style={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid rgba(17,17,17,0.1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: 600, color: '#111', width: '100%', textAlign: 'center' }}>
                ATS Readiness Score
            </h3>

            <div style={{ position: 'relative', width: '120px', height: '120px', marginBottom: '16px' }}>
                {/* Background Circle */}
                <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke="#f0f0f0"
                        strokeWidth="8"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth="8"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.3s ease' }}
                    />
                </svg>

                {/* Center Text */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '32px', fontWeight: 700, color: color, lineHeight: 1 }}>
                        {score}
                    </span>
                    <span style={{ fontSize: '12px', color: '#666', fontWeight: 500, marginTop: '2px' }}>
                        / 100
                    </span>
                </div>
            </div>

            <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: color,
                backgroundColor: `${color}15`, // extremely light tint of the color
                padding: '6px 16px',
                borderRadius: '100px',
                marginBottom: suggestions.length > 0 ? '24px' : '0'
            }}>
                {statusText}
            </div>

            {suggestions.length > 0 && (
                <div style={{ width: '100%' }}>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Missing Items
                    </h4>
                    <ul style={{
                        margin: 0,
                        paddingLeft: '0',
                        listStyle: 'none',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                    }}>
                        {suggestions.map((req, idx) => (
                            <li key={idx} style={{
                                fontSize: '13px',
                                color: '#444',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '8px',
                                background: '#f9f9f9',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                borderLeft: '3px solid #ddd'
                            }}>
                                <span style={{ color: '#888', flexShrink: 0 }}>•</span>
                                <span>{req}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default ATSScoreDisplay;
