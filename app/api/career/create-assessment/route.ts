import { NextResponse } from 'next/server';

const dsaQuestions = [
  {
    question: 'What is the time complexity of searching an element in a Binary Search Tree in the worst case?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(n)'
  },
  {
    question: 'Which data structure uses LIFO (Last In First Out) principle?',
    options: ['Queue', 'Stack', 'Linked List', 'Tree'],
    correctAnswer: 'Stack'
  },
  {
    question: 'What is the primary advantage of a hash table?',
    options: ['O(1) search time on average', 'Memory efficiency', 'Ordered data storage', 'Simplicity of implementation'],
    correctAnswer: 'O(1) search time on average'
  },
  {
    question: 'Which of the following is NOT a linear data structure?',
    options: ['Array', 'Linked List', 'Queue', 'Tree'],
    correctAnswer: 'Tree'
  },
  {
    question: 'What is the space complexity of a recursive algorithm with maximum recursion depth n?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(n)'
  }
];

const jsQuestions = [
  {
    question: 'What will be the output of: console.log(typeof null)?',
    options: ['null', 'object', 'undefined', 'number'],
    correctAnswer: 'object'
  },
  {
    question: 'What is the correct way to check if a variable is an array in JavaScript?',
    options: [
      'typeof variable === "array"', 
      'variable instanceof Array', 
      'variable.constructor === Array', 
      'Array.isArray(variable)'
    ],
    correctAnswer: 'Array.isArray(variable)'
  },
  {
    question: 'What does the "use strict" directive do in JavaScript?',
    options: [
      'Forces all variables to be strictly typed',
      'Enables strict mode which catches common coding mistakes',
      'Makes performance faster by strict optimizations',
      'Restricts the use of arrow functions'
    ],
    correctAnswer: 'Enables strict mode which catches common coding mistakes'
  },
  {
    question: 'How do you properly create a Promise in JavaScript?',
    options: [
      'var promise = Promise(resolve, reject) => {}',
      'var promise = new Promise(function(resolve, reject) {})',
      'var promise = Promise.create((resolve, reject) => {})',
      'var promise = await Promise((resolve, reject) => {})'
    ],
    correctAnswer: 'var promise = new Promise(function(resolve, reject) {})'
  },
  {
    question: 'What is event bubbling in JavaScript?',
    options: [
      'A technique to handle multiple events simultaneously',
      'When an event travels up from the target element to the root element',
      'A way to optimize event listeners in modern browsers',
      'The process of generating new events automatically'
    ],
    correctAnswer: 'When an event travels up from the target element to the root element'
  }
];

const reactQuestions = [
  {
    question: 'What hook would you use to run side effects in a functional component?',
    options: ['useState', 'useEffect', 'useContext', 'useReducer'],
    correctAnswer: 'useEffect'
  },
  {
    question: 'What is the correct way to conditionally render a component in React?',
    options: [
      'if(condition) { <Component /> }',
      '<Component if={condition} />',
      '{condition && <Component />}',
      '<if condition={true}><Component /></if>'
    ],
    correctAnswer: '{condition && <Component />}'
  },
  {
    question: 'How do you properly pass a prop called "name" to a child component?',
    options: [
      '<Child name={name} />',
      '<Child prop:name={name} />',
      '<Child this.props.name={name} />',
      '<Child setName={name} />'
    ],
    correctAnswer: '<Child name={name} />'
  },
  {
    question: 'Which method is NOT part of React component lifecycle in class components?',
    options: [
      'componentDidMount',
      'componentDidUpdate',
      'componentWillReceiveState',
      'componentWillUnmount'
    ],
    correctAnswer: 'componentWillReceiveState'
  },
  {
    question: 'What is the purpose of keys in React lists?',
    options: [
      'To make the list items sortable',
      'To provide a way to access list items directly',
      'To help React identify which items have changed, added, or removed',
      'To enable animations between list updates'
    ],
    correctAnswer: 'To help React identify which items have changed, added, or removed'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Extract topic and questionCount, ignore difficulty level for now
    const { topic, questionCount = 5 } = body;

    // Select questions based on the topic
    // Note: In a real implementation, we would filter by difficulty level too
    let questions;
    if (topic.toLowerCase().includes('data structure') || topic.toLowerCase().includes('algorithm')) {
      questions = dsaQuestions;
    } else if (topic.toLowerCase().includes('javascript') || topic.toLowerCase().includes('js')) {
      questions = jsQuestions;
    } else if (topic.toLowerCase().includes('react')) {
      questions = reactQuestions;
    } else {
      // Default to DSA questions
      questions = dsaQuestions;
    }

    // Return the questions
    return NextResponse.json({ assessment: questions.slice(0, questionCount) });
  } catch (error) {
    console.error('Error creating assessment:', error);
    return NextResponse.json({ error: 'Failed to create assessment' }, { status: 500 });
  }
}