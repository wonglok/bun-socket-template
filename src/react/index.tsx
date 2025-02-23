/// <reference lib="dom" />
/// <reference lib="dom.iterable" />

import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import {ReactApp} from './ReactApp'

export const hydrateReactSite = ({ seoData }: any) => {
    hydrateRoot(document, <ReactApp seoData={seoData} />)
}
