import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useFonts } from "expo-font";

interface Card {
  id: number;
  icon: any;
  isFlipped: boolean;
  isMatched: boolean;
}

const cardImages = [
  require("../assets/images/Coffee.png"),
  require("../assets/images/Gaming.png"),
  require("../assets/images/Food.png"),
  require("../assets/images/Plants.png"),
  require("../assets/images/Music.png"),
  require("../assets/images/Party.png"),
];
const cardBackImage = require("../assets/images/cardBack.png");

const generateCards = (): Card[] => {
  const cards: Card[] = [...cardImages, ...cardImages].map((icon, index) => ({
    id: index,
    icon,
    isFlipped: false,
    isMatched: false,
  }));
  return cards.sort(() => Math.random() - 0.5);
};

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<Card[]>(generateCards());
  const [flippedCards, setFlippedCards] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);

  const [fontsLoaded] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });
  if (!fontsLoaded) {
    return <Text>Loading Fonts...</Text>;
  }

  useEffect(() => {
    let interval: number | undefined;
    if (timerActive && !isGameFinished) {
      interval = setInterval(
        () => setTime((prev) => prev + 1),
        1000
      ) as unknown as number;
    }
    return () => {
      if (interval !== undefined) {
        clearInterval(interval as number);
      }
    };
  }, [timerActive, isGameFinished]);

  const handleCardFlip = (card: Card) => {
    if (!timerActive) {
      setTimerActive(true);
    }

    if (flippedCards.length === 2 || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    const newFlippedCards = [...flippedCards, card];

    setFlippedCards(newFlippedCards);
    setCards([...cards]);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      if (newFlippedCards[0].icon === newFlippedCards[1].icon) {
        newFlippedCards[0].isMatched = true;
        newFlippedCards[1].isMatched = true;
      }
      setTimeout(() => {
        newFlippedCards.forEach((card) => (card.isFlipped = false));
        setFlippedCards([]);
        setCards([...cards]);
        if (cards.every((card) => card.isMatched)) {
          setIsGameFinished(true);
          setTimerActive(false);
        }
      }, 1000);
    }
  };

  const handleRestart = () => {
    setCards(generateCards());
    setFlippedCards([]);
    setMoves(0);
    setTime(0);
    setTimerActive(false);
    setIsGameFinished(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.matchText}>Match it !</Text>
      <Text style={styles.matchText2}>Moves: {moves}</Text>
      <Text style={styles.matchText2}>Time: {time}s</Text>
      {isGameFinished && (
        <Text style={styles.matchText2}>
          🎉 Congrats! You beat the game! 🎉
        </Text>
      )}
      <View style={styles.grid}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={styles.card}
            onPress={() => handleCardFlip(card)}
          >
            <View style={styles.cardContent}>
              {card.isFlipped || card.isMatched ? (
                <Image source={card.icon} style={styles.cardImage} />
              ) : (
                <Image source={cardBackImage} style={styles.cardImage} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleRestart}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "95%",
    justifyContent: "space-evenly",
  },
  card: {
    width: 95,
    height: 95,
    backgroundColor: "#FFF5DB",
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    elevation: 3,
  },
  cardContent: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardImage: {
    width: 95,
    height: 95,
  },
  button: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#444343",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "regular",
    fontSize: 18,
    fontFamily: "Roboto-Regular",
  },
  matchText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#444343",
    marginBottom: 20,
  },
  matchText2: {
    fontSize: 20,
    color: "#444343",
    marginBottom: 20,
  },
});

export default MemoryGame;
