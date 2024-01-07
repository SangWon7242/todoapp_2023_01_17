"use client"

import Head from 'next/head'
import Link from 'next/link'

export default function Home() {    

  return (
    <>
      <Head>        
        <meta charset="UTF-8" />	            
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>  
      <h1>앱 소개 페이지</h1>

      <nav>
        <Link href="/" legacyBehavior>
          <a className="text-red-300">메인</a>
        </Link>

        <Link href="/about" legacyBehavior>
          <a className="text-blue-300">어바웃</a>
        </Link>
      </nav> 
    </>  
  );
}
