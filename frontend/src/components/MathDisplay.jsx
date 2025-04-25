import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

const MathDisplay = ({ inline, formula }) => {
    return inline ? <InlineMath math={formula} /> : <BlockMath math={formula} />;
};

export default MathDisplay;