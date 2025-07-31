import { BmiContext } from "../contexts";
import { useContext } from "react";

export const useBmi = () => {
    const {bmi, setBmi} = useContext(BmiContext);
    return {bmi, setBmi};
}