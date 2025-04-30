"use client";

import React from 'react';
import Image from "next/image";
import { motion } from 'framer-motion';

const Banner = () => {
    // Animation variants for the image (coming from the right)
    const imageVariants = {
        hidden: {x: '100%', opacity: 0},
        visible: {x: 0, opacity: 1, transition: {duration: 1}},
    };

    // Animation variants for the text (coming from the left)
    const textVariants = {
        hidden: {x: '-100%', opacity: 0},
        visible: {x: 0, opacity: 1, transition: {duration: 1}},
    };

    return (
        <div className='flex flex-col md:flex-row-reverse py-16 justify-between items-center gap-12'>
            {/* Animated Image div */}
            <motion.div
                className='md:w-1/2 w-full flex items-center md:justify-end'
                initial="hidden"
                animate="visible"
                variants={imageVariants}
            >
                <Image src="/assets/banner.png" alt="banner" width={500} height={400}/>
            </motion.div>

            {/* Animated Text div */}
            <motion.div
                className='md:w-1/2 w-full'
                initial="hidden"
                animate="visible"
                variants={textVariants}
            >
                <h1 className='md:text-5xl text-2xl font-medium mb-7'>New Releases This Week</h1>
                <p className='mb-10'>
                    It's time to update your reading list with some of the latest and greatest releases
                    in the literary world.
                </p>
                <button className='btn-primary'>Subscribe</button>
            </motion.div>
        </div>
    );
};

export default Banner;
