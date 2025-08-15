import { AuthContext } from "../contexts";
import { useContext } from "react";

export const useAuth = () => {
    const {auth, setAuth, book, setBook} = useContext(AuthContext);
    return {auth, setAuth, book, setBook};
}