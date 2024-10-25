import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-6NJ9TKD40J");
};

export const logPageView = (url: string) => {
  ReactGA.send({ hitType: "pageview", page: url });
};
