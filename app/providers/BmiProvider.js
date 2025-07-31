'use client'

import {useState} from 'react';

import { BmiContext } from '../contexts';

export default function BmiProvider({children}) {
    const [bmi, setBmi] = useState(0);

    return(
        <BmiContext.Provider value={{bmi, setBmi}}>
            {children}
        </BmiContext.Provider>
    )
}