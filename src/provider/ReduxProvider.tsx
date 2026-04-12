'use client'

import { store } from "@/app/redux/store"
import { Provider } from "react-redux"

export default function ReduxProvider({children}:{children:React.ReactNode}){
    return(
        <div>
            <Provider store={store}>

            {children}
            </Provider>
        </div>
    )
}
