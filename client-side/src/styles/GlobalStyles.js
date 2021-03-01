import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    * {
        margin: 0px;
        padding: 0px;
        box-sizing: border-box;
    }

    html {
        scroll-behavior: smooth;
        
        @media screen and (max-width: 800px) {
            font-size: 70%;
        }
    }

    body {
        width: 100%;
        font-size: 62.5%;

        &::-webkit-scrollbar {
         width: 5px;
        }

        &::-webkit-scrollbar-thumb {
            background: gray;
        }
    }

    h2 {
        font-size: 3rem;
        font-weight: lighter;
        color: #333;
    }

    label, h3 {
        font-size: 1.3rem;
        color: #333;
        padding: 1.5rem 0rem;
    }

    a {
        text-decoration: none;
        color: black;
    }

    ul {
        list-style: none;
    }
`;

export default GlobalStyles;
