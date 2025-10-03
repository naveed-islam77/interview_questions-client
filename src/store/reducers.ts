
import { categoryApiReducer, categoryApiReducerPath } from '@/services/categoryApi'
import { questionApiReducer, questionApiReducerPath } from '@/services/questionApi'
import { combineReducers } from '@reduxjs/toolkit'


export const rootReducers = combineReducers({
    [questionApiReducerPath]: questionApiReducer,
    [categoryApiReducerPath]: categoryApiReducer
})