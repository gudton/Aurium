const express = require('express');
const { Pool } = require('pg'); 

const app = express();
const port = 3000;

const pool = new Pool({
    user: 'postgres',
    host: 'db',
    database: 'aurium',
    password: 'postgres',
    port: 5432,
});

app.get('/', async (req, res) => {
    const result = await pool.query('SELECT NOW()');
    res.send(`Current time: ${result.rows[0].now}`);
});




function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

app.get('/questions', async (req, res) => {
  try {
    const { rows: questions } = await pool.query('SELECT * FROM questions');
    const shuffledQuestions = shuffleArray(questions);

    const fullQuestions = await Promise.all(
      shuffledQuestions.map(async (q) => {
        const { rows: answers } = await pool.query(
          'SELECT id, text FROM answers WHERE question_id = $1',
          [q.id]
        );

        return {
          id: q.id,
          text: q.text,
          answers: shuffleArray(answers),
        };
      })
    );

    res.json(fullQuestions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar perguntas');
  }
});




//coisa pra ver onde ta rodando
app.listen(port, () => {
    console.log(`Server Rodando na porta http://localhost:${port}`);
});

