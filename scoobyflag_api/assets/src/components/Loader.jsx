import React from "react";


export default function Loader({ visible = true, size = 200, ...other }) {
    if (!visible)
        return <></>

    return (
        <div style={{ display: "flex", height: "100%", alignItems: 'center', justifyContent: 'center' }}>
            <svg
                {...other}
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                width={size}
                height={size}
                viewBox="0 0 100 100"
                preserveAspectRatio="xMidYMid"
            >
                <circle
                    cx="50"
                    cy="50"
                    r="32"
                    strokeWidth="8"
                    stroke="black"
                    strokeDasharray="50.26548245743669 50.26548245743669"
                    fill="none"
                    strokeLinecap="round"
                >
                    <animateTransform
                        attributeName="transform"
                        type="rotate"
                        repeatCount="indefinite"
                        dur="1s"
                        keyTimes="0;1"
                        values="0 50 50;360 50 50"
                    ></animateTransform>
                </circle>
            </svg>
        </div>
    )
}