import { useState } from "react";
import axios from "axios";
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Heading,
  Container,
  Divider,
  List,
  ListItem,
  useDisclosure,
} from "@chakra-ui/react";

function App() {
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState([]);
  const [results, setResults] = useState({});
  const [showAnswers, setShowAnswers] = useState(false);

  const handleAddTopic = async () => {
    if (!topic.trim()) return;
    try {
      const res = await axios.post("http://localhost:8000/generate", { topic });
      const content = res.data.output;
      setTopics((prev) => [...prev, topic]);
      setResults((prev) => ({ ...prev, [topic]: content }));
      setTopic("");
      setShowAnswers(false);
    } catch (error) {
      console.error("Error generating quiz:", error);
    }
  };

  return (
    <HStack h="100vh" spacing={0} align="stretch">
      {/* Sidebar */}
      <Box w="64" bg="blue.600" color="white" p={6}>
        <Heading size="md" mb={4}>Saved Topics</Heading>
        <VStack align="start" spacing={2}>
          {topics.map((t) => (
            <Text
              key={t}
              onClick={() => {
                setTopic(t);
                setShowAnswers(false);
              }}
              cursor="pointer"
              _hover={{ color: "blue.200" }}
            >
              {t}
            </Text>
          ))}
        </VStack>
      </Box>

      {/* Main content */}
      <Box flex={1} p={8} bg="gray.50" overflowY="auto">
        <Container maxW="4xl">
          <Heading size="xl" mb={6} textAlign="center" color="blue.700">
            AI Quiz Maker
          </Heading>

          <HStack mb={8}>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter a study topic"
              bg="white"
              flex={1}
            />
            <Button colorScheme="blue" onClick={handleAddTopic}>
              Generate Quiz
            </Button>
          </HStack>

          {results[topic] && (
            <QuizDisplay
              text={results[topic]}
              showAnswers={showAnswers}
              setShowAnswers={setShowAnswers}
            />
          )}
        </Container>
      </Box>
    </HStack>
  );
}

function QuizDisplay({ text, showAnswers, setShowAnswers }) {
  const lines = text.split("\n").filter((line) => line.trim() !== "");
  const questions = [];
  const answers = [];

  let summary = "";
  let currentQuestion = null;
  let inSummary = true;
  let inAnswerKey = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (/^answer[s]?[:\s]/i.test(line)) {
      inAnswerKey = true;
      continue;
    }

    if (inAnswerKey) {
      const match = line.match(/^(\d+)\.\s*(.+)$/);
      if (match) {
        answers[parseInt(match[1], 10) - 1] = match[2].trim();
      }
      continue;
    }

    if (inSummary && /^\d+\./.test(line)) {
      inSummary = false;
    }

    if (inSummary) {
      summary += line + " ";
      continue;
    }

    if (/^\d+\./.test(line)) {
      if (currentQuestion) questions.push(currentQuestion);
      currentQuestion = {
        text: line,
        choices: [],
      };
    } else if (/^[a-dA-D]\)/.test(line)) {
      currentQuestion?.choices.push(line);
    }
  }

  if (currentQuestion) questions.push(currentQuestion);

  return (
    <VStack align="stretch" spacing={6}>
      {/* Summary */}
      {summary && (
        <Box bg="blue.100" p={4} rounded="md" borderWidth={1}>
          <Heading size="sm" mb={2} color="blue.800">
            Summary
          </Heading>
          <Text color="gray.700">{summary.trim()}</Text>
        </Box>
      )}

      {/* Questions */}
      {questions.map((q, i) => (
        <Box key={i} bg="white" p={6} rounded="lg" shadow="sm" borderWidth={1}>
          <Text fontWeight="semibold" mb={3}>{q.text}</Text>
          {q.choices.length > 0 ? (
            <VStack align="start" spacing={3} pl={2}>
              {q.choices.map((choice, idx) => (
                <Text key={idx}>{choice}</Text>
              ))}
            </VStack>
          ) : (
            <Text pl={2} fontStyle="italic" color="gray.600">
              (Fill-in-the-blank or short answer — see answer key.)
            </Text>
          )}
        </Box>
      ))}

      {/* Answer Key */}
      {answers.length > 0 && (
        <Box>
          <Button
            onClick={() => setShowAnswers(!showAnswers)}
            variant="link"
            colorScheme="blue"
          >
            {showAnswers ? "Hide Answer Key" : "Show Answer Key"}
          </Button>

          {showAnswers && (
            <Box bg="gray.100" mt={2} p={4} rounded="md" borderWidth={1}>
              <Heading size="sm" mb={2}>Answer Key</Heading>
              <List spacing={1} pl={4} styleType="decimal">
                {answers.map((a, i) => (
                  <ListItem key={i}>{a}</ListItem>
                ))}
              </List>
            </Box>
          )}
        </Box>
      )}
    </VStack>
  );
}

export default App;
