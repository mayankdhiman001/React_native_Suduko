// ================================================================
//    _____ _   _ _____   ____  _  ___   _ 
//   / ____| | | |  __ \ / __ \| |/ / | | |
//  | (___ | | | | |  | | |  | | ' /| | | |
//   \___ \| | | | |  | | |  | |  < | | | |
//   ____) | |_| | |__| | |__| | . \| |_| |
//  |_____/ \___/|_____/ \____/|_|\_\\___/ 
//                                         
//         SMART SUDOKU SOLVER v2.0
//         React Native 0.80 - Smooth Edition BY Mayank Dhiman
// ================================================================


// ================================================================
// PART 1: IMPORTS
// ================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Modal,
  StatusBar,
  ScrollView,
  SafeAreaView,
} from 'react-native';


// ================================================================
// PART 2: CONSTANTS
// ================================================================

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_SIZE = Math.min(SCREEN_WIDTH - 40, 350);
const CELL_SIZE = GRID_SIZE / 9;

// Animation duration constant - isse adjust karke speed badal sakte ho
const ANIMATION_DURATION = 200;


// ================================================================
// PART 3: SUDOKU PUZZLES
// ================================================================

const PUZZLES = {
  easy: [
    [
      [5, 3, 0, 0, 7, 0, 0, 0, 0],
      [6, 0, 0, 1, 9, 5, 0, 0, 0],
      [0, 9, 8, 0, 0, 0, 0, 6, 0],
      [8, 0, 0, 0, 6, 0, 0, 0, 3],
      [4, 0, 0, 8, 0, 3, 0, 0, 1],
      [7, 0, 0, 0, 2, 0, 0, 0, 6],
      [0, 6, 0, 0, 0, 0, 2, 8, 0],
      [0, 0, 0, 4, 1, 9, 0, 0, 5],
      [0, 0, 0, 0, 8, 0, 0, 7, 9],
    ],
    [
      [0, 0, 0, 2, 6, 0, 7, 0, 1],
      [6, 8, 0, 0, 7, 0, 0, 9, 0],
      [1, 9, 0, 0, 0, 4, 5, 0, 0],
      [8, 2, 0, 1, 0, 0, 0, 4, 0],
      [0, 0, 4, 6, 0, 2, 9, 0, 0],
      [0, 5, 0, 0, 0, 3, 0, 2, 8],
      [0, 0, 9, 3, 0, 0, 0, 7, 4],
      [0, 4, 0, 0, 5, 0, 0, 3, 6],
      [7, 0, 3, 0, 1, 8, 0, 0, 0],
    ],
  ],

  medium: [
    [
      [0, 0, 0, 6, 0, 0, 4, 0, 0],
      [7, 0, 0, 0, 0, 3, 6, 0, 0],
      [0, 0, 0, 0, 9, 1, 0, 8, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 5, 0, 1, 8, 0, 0, 0, 3],
      [0, 0, 0, 3, 0, 6, 0, 4, 5],
      [0, 4, 0, 2, 0, 0, 0, 6, 0],
      [9, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 2, 0, 0, 0, 0, 1, 0, 0],
    ],
    [
      [0, 2, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 6, 0, 0, 0, 0, 3],
      [0, 7, 4, 0, 8, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 0, 2],
      [0, 8, 0, 0, 4, 0, 0, 1, 0],
      [6, 0, 0, 5, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 7, 8, 0],
      [5, 0, 0, 0, 0, 9, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 4, 0],
    ],
  ],

  hard: [
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 3, 0, 8, 5],
      [0, 0, 1, 0, 2, 0, 0, 0, 0],
      [0, 0, 0, 5, 0, 7, 0, 0, 0],
      [0, 0, 4, 0, 0, 0, 1, 0, 0],
      [0, 9, 0, 0, 0, 0, 0, 0, 0],
      [5, 0, 0, 0, 0, 0, 0, 7, 3],
      [0, 0, 2, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 4, 0, 0, 0, 9],
    ],
    [
      [8, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 3, 6, 0, 0, 0, 0, 0],
      [0, 7, 0, 0, 9, 0, 2, 0, 0],
      [0, 5, 0, 0, 0, 7, 0, 0, 0],
      [0, 0, 0, 0, 4, 5, 7, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 3, 0],
      [0, 0, 1, 0, 0, 0, 0, 6, 8],
      [0, 0, 8, 5, 0, 0, 0, 1, 0],
      [0, 9, 0, 0, 0, 0, 4, 0, 0],
    ],
  ],
};


// ================================================================
// PART 4: HELPER FUNCTIONS
// ================================================================

function getRandomPuzzle(difficulty) {
  const puzzleList = PUZZLES[difficulty];
  const randomIndex = Math.floor(Math.random() * puzzleList.length);
  return JSON.parse(JSON.stringify(puzzleList[randomIndex]));
}

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
}

function validateBoard(board) {
  const invalidCells = new Set();

  // Row check
  for (let row = 0; row < 9; row++) {
    const seen = {};
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen[num] !== undefined) {
          invalidCells.add(row + '-' + seen[num]);
          invalidCells.add(row + '-' + col);
        } else {
          seen[num] = col;
        }
      }
    }
  }

  // Column check
  for (let col = 0; col < 9; col++) {
    const seen = {};
    for (let row = 0; row < 9; row++) {
      const num = board[row][col];
      if (num !== 0) {
        if (seen[num] !== undefined) {
          invalidCells.add(seen[num] + '-' + col);
          invalidCells.add(row + '-' + col);
        } else {
          seen[num] = row;
        }
      }
    }
  }

  // 3x3 box check
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const seen = {};
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          const row = boxRow * 3 + i;
          const col = boxCol * 3 + j;
          const num = board[row][col];
          if (num !== 0) {
            const key = num.toString();
            if (seen[key]) {
              invalidCells.add(seen[key]);
              invalidCells.add(row + '-' + col);
            } else {
              seen[key] = row + '-' + col;
            }
          }
        }
      }
    }
  }

  return invalidCells;
}

function isPuzzleSolved(board, invalidCells) {
  if (invalidCells.size > 0) return false;
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === 0) return false;
    }
  }
  return true;
}


// ================================================================
// PART 5: SUDOKU CELL COMPONENT - Improved
// ================================================================

function SudokuCell({ value, isInitial, isSelected, isInvalid, isHighlighted, row, col, onPress }) {
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;

  // Select animation - smooth spring
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 0.92 : 1,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [isSelected]);

  // Invalid shake animation
  useEffect(() => {
    if (isInvalid && value !== 0) {
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -6, duration: 40, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [isInvalid, value]);

  // Border style - 3x3 box borders
  const getBorderStyle = () => ({
    borderRightWidth: (col === 2 || col === 5) ? 2.5 : 0.5,
    borderRightColor: (col === 2 || col === 5) ? '#1E3A5F' : '#CBD5E1',
    borderBottomWidth: (row === 2 || row === 5) ? 2.5 : 0.5,
    borderBottomColor: (row === 2 || row === 5) ? '#1E3A5F' : '#CBD5E1',
  });

  // Background color based on state
  const getBackgroundColor = () => {
    if (isInvalid) return '#FEE2E2';
    if (isSelected) return '#BFDBFE';
    if (isHighlighted) return '#E0F2FE';
    if (isInitial) return '#F1F5F9';
    return '#FFFFFF';
  };

  // Text color
  const getTextColor = () => {
    if (isInvalid) return '#DC2626';
    if (isInitial) return '#0F172A';
    return '#2563EB';
  };

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={() => onPress(row, col)}
      disabled={isInitial}
    >
      <Animated.View
        style={[
          styles.cell,
          getBorderStyle(),
          {
            backgroundColor: getBackgroundColor(),
            transform: [
              { scale: scaleAnim },
              { translateX: shakeAnim },
            ],
          },
        ]}
      >
        <Text style={[
          styles.cellText,
          { color: getTextColor() },
          isInitial && styles.initialCellText,
        ]}>
          {value !== 0 ? value.toString() : ''}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
}


// ================================================================
// PART 6: NUMBER PAD - Smooth Buttons
// ================================================================

function NumberPad({ onNumberPress, onClear, disabled }) {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const buttonAnims = useRef(numbers.map(() => new Animated.Value(1))).current;
  const clearAnim = useRef(new Animated.Value(1)).current;

  const handleNumberPress = (num, index) => {
    // Smooth bounce
    Animated.sequence([
      Animated.timing(buttonAnims[index], {
        toValue: 0.85,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnims[index], {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();

    onNumberPress(num);
  };

  const handleClearPress = () => {
    Animated.sequence([
      Animated.timing(clearAnim, {
        toValue: 0.9,
        duration: 60,
        useNativeDriver: true,
      }),
      Animated.spring(clearAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    onClear();
  };

  return (
    <View style={styles.numberPadContainer}>
      <View style={styles.numberPadGrid}>
        {numbers.map((num, index) => (
          <TouchableOpacity
            key={num}
            onPress={() => handleNumberPress(num, index)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.numberButton,
                { transform: [{ scale: buttonAnims[index] }] },
                disabled && styles.numberButtonDisabled,
              ]}
            >
              <Text style={[
                styles.numberButtonText,
                disabled && styles.numberButtonTextDisabled,
              ]}>
                {num}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        onPress={handleClearPress}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Animated.View
          style={[
            styles.clearButton,
            { transform: [{ scale: clearAnim }] },
            disabled && styles.clearButtonDisabled,
          ]}
        >
          <Text style={styles.clearButtonText}>✕ Clear</Text>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}


// ================================================================
// PART 7: VICTORY MODAL - Celebration
// ================================================================

function VictoryModal({ visible, moves, time, onNewGame }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset values
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      rotateAnim.setValue(0);

      // Start animations
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 5,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();

      // Trophy wiggle
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: -1, duration: 300, useNativeDriver: true }),
          Animated.timing(rotateAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [visible]);

  const trophyRotate = rotateAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-15deg', '0deg', '15deg'],
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.modalBackground, { opacity: fadeAnim }]}>
        <Animated.View style={[styles.modalBox, { transform: [{ scale: scaleAnim }] }]}>
          
          <Animated.Text style={[styles.trophyEmoji, { transform: [{ rotate: trophyRotate }] }]}>
            🏆
          </Animated.Text>

          <Text style={styles.congratsTitle}>🎉 Badhai Ho!</Text>
          <Text style={styles.congratsSubtitle}>Puzzle Solve Ho Gaya!</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{moves}</Text>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{time}</Text>
              <Text style={styles.statLabel}>Time</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.playAgainButton} onPress={onNewGame} activeOpacity={0.8}>
            <Text style={styles.playAgainButtonText}>🎮 Naya Game</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}


// ================================================================
// PART 8: DIFFICULTY SELECTOR - Smooth Transition Fix
// ================================================================

function DifficultySelector({ current, onSelect, disabled }) {
  const options = [
    { key: 'easy', label: '😊 Easy', color: '#10B981' },
    { key: 'medium', label: '🤔 Medium', color: '#F59E0B' },
    { key: 'hard', label: '😈 Hard', color: '#EF4444' },
  ];

  // Animation for each button
  const buttonAnims = useRef(options.map(() => new Animated.Value(1))).current;

  const handlePress = (key, index) => {
    // Agar same difficulty hai toh kuch mat karo
    if (key === current) return;

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonAnims[index], {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnims[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Callback after small delay for smooth feel
    // setTimeout(() => {
      onSelect(key);
    // }, 50);
  };

  return (
    <View style={styles.difficultyContainer}>
      {options.map((opt, index) => {
        const isActive = current === opt.key;

        return (
          <TouchableOpacity
            key={opt.key}
            onPress={() => handlePress(opt.key, index)}
            disabled={disabled}
            activeOpacity={0.7}
          >
            <Animated.View
              style={[
                styles.difficultyButton,
                isActive && { backgroundColor: opt.color },
                disabled && styles.difficultyButtonDisabled,
                { transform: [{ scale: buttonAnims[index] }] },
              ]}
            >
              <Text style={[
                styles.difficultyText,
                isActive && styles.difficultyTextActive,
              ]}>
                {opt.label}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


// ================================================================
// PART 9: MAIN APP - Fixed Animation Logic
// ================================================================

function App() {
  // ----- STATE -----
  const [difficulty, setDifficulty] = useState('easy');
  const [initialBoard, setInitialBoard] = useState([]);
  const [currentBoard, setCurrentBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [invalidCells, setInvalidCells] = useState(new Set());
  const [isSolved, setIsSolved] = useState(false);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  
  // NEW: Loading state for smooth transition
  const [isLoading, setIsLoading] = useState(false);

  // Animation refs
  const gridOpacity = useRef(new Animated.Value(1)).current;
  const gridScale = useRef(new Animated.Value(1)).current;

  // ----- INITIAL LOAD -----
  useEffect(() => {
    loadGame('easy', true);
  }, []);

  // ----- TIMER -----
  useEffect(() => {
    let timer = null;
    if (isTimerRunning && !isSolved) {
      timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, isSolved]);

  // ----- LOAD GAME - Smooth Animation -----
  const loadGame = useCallback((diff, isFirstLoad = false) => {
    // Agar already loading hai toh skip
    if (isLoading) return;

    setIsLoading(true);

    if (isFirstLoad) {
      // First time load - simple fade in
      const puzzle = getRandomPuzzle(diff);
      
      setDifficulty(diff);
      setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
      setCurrentBoard(JSON.parse(JSON.stringify(puzzle)));
      setSelectedCell(null);
      setInvalidCells(new Set());
      setIsSolved(false);
      setMoves(0);
      setSeconds(0);
      setIsTimerRunning(true);

      gridOpacity.setValue(0);
      gridScale.setValue(0.9);

      Animated.parallel([
        Animated.timing(gridOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.spring(gridScale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsLoading(false);
      });

    } else {
      // Difficulty change - Fade out, change, fade in (SMOOTH)
      
      // Step 1: Fade out current grid
      Animated.parallel([
        Animated.timing(gridOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(gridScale, {
          toValue: 0.95,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        
        // Step 2: Change puzzle (while hidden)
        const puzzle = getRandomPuzzle(diff);
        
        setDifficulty(diff);
        setInitialBoard(JSON.parse(JSON.stringify(puzzle)));
        setCurrentBoard(JSON.parse(JSON.stringify(puzzle)));
        setSelectedCell(null);
        setInvalidCells(new Set());
        setIsSolved(false);
        setMoves(0);
        setSeconds(0);
        setIsTimerRunning(true);

        // Step 3: Fade in new grid
        Animated.parallel([
          Animated.timing(gridOpacity, {
            toValue: 1,
            duration: ANIMATION_DURATION,
            useNativeDriver: true,
          }),
          Animated.spring(gridScale, {
            toValue: 1,
            friction: 6,
            tension: 80,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsLoading(false);
        });
      });
    }
  }, [isLoading]);

  // ----- RESET PUZZLE -----
  const resetPuzzle = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Quick bounce animation
    Animated.sequence([
      Animated.timing(gridScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(gridScale, {
        toValue: 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsLoading(false);
    });

    setCurrentBoard(JSON.parse(JSON.stringify(initialBoard)));
    setSelectedCell(null);
    setInvalidCells(new Set());
    setMoves(0);
    setSeconds(0);
    setIsTimerRunning(true);
  }, [initialBoard, isLoading]);

  // ----- CELL PRESS -----
  const handleCellPress = useCallback((row, col) => {
    if (isLoading) return;
    if (initialBoard[row] && initialBoard[row][col] !== 0) return;
    setSelectedCell({ row, col });
  }, [initialBoard, isLoading]);

  // ----- NUMBER PRESS -----
  const handleNumberPress = useCallback((num) => {
    if (!selectedCell || isLoading) return;

    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = num;
    setCurrentBoard(newBoard);
    setMoves(prev => prev + 1);

    const newInvalid = validateBoard(newBoard);
    setInvalidCells(newInvalid);

    if (isPuzzleSolved(newBoard, newInvalid)) {
      setIsSolved(true);
      setIsTimerRunning(false);
    }
  }, [selectedCell, initialBoard, currentBoard, isLoading]);

  // ----- CLEAR CELL -----
  const handleClearCell = useCallback(() => {
    if (!selectedCell || isLoading) return;

    const { row, col } = selectedCell;
    if (initialBoard[row][col] !== 0) return;

    const newBoard = currentBoard.map(r => [...r]);
    newBoard[row][col] = 0;
    setCurrentBoard(newBoard);
    setMoves(prev => prev + 1);
    setInvalidCells(validateBoard(newBoard));
  }, [selectedCell, initialBoard, currentBoard, isLoading]);

  // ----- HIGHLIGHT CHECK -----
  const shouldHighlight = useCallback((row, col) => {
    if (!selectedCell) return false;

    const { row: selRow, col: selCol } = selectedCell;

    // Same row or column
    if (row === selRow || col === selCol) return true;

    // Same 3x3 box
    const boxRow = Math.floor(row / 3);
    const boxCol = Math.floor(col / 3);
    const selBoxRow = Math.floor(selRow / 3);
    const selBoxCol = Math.floor(selCol / 3);

    return boxRow === selBoxRow && boxCol === selBoxCol;
  }, [selectedCell]);

  // ----- RENDER -----
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🧩 Sudoku</Text>
          <Text style={styles.subtitle}>Smart Solver & Validator</Text>
        </View>

        {/* Difficulty - with disabled state during loading */}
        <DifficultySelector
          current={difficulty}
          onSelect={(diff) => loadGame(diff, false)}
          disabled={isLoading}
        />

        {/* Stats Bar */}
        <View style={styles.statsBar}>
          <View style={styles.statsItem}>
            <Text style={styles.statsIcon}>⏱️</Text>
            <Text style={styles.statsText}>{formatTime(seconds)}</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsIcon}>📝</Text>
            <Text style={styles.statsText}>{moves} moves</Text>
          </View>
          <View style={styles.statsItem}>
            <Text style={styles.statsIcon}>{invalidCells.size > 0 ? '❌' : '✅'}</Text>
            <Text style={[styles.statsText, invalidCells.size > 0 && styles.errorText]}>
              {invalidCells.size} errors
            </Text>
          </View>
        </View>

        {/* Sudoku Grid - Animated */}
        <Animated.View
          style={[
            styles.gridWrapper,
            {
              opacity: gridOpacity,
              transform: [{ scale: gridScale }],
            },
          ]}
        >
          <View style={styles.gridBorder}>
            {currentBoard.map((rowData, rowIndex) => (
              <View key={rowIndex} style={styles.gridRow}>
                {rowData.map((cellValue, colIndex) => (
                  <SudokuCell
                    key={`${rowIndex}-${colIndex}`}
                    value={cellValue}
                    isInitial={initialBoard[rowIndex] && initialBoard[rowIndex][colIndex] !== 0}
                    isSelected={selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex}
                    isInvalid={invalidCells.has(`${rowIndex}-${colIndex}`)}
                    isHighlighted={shouldHighlight(rowIndex, colIndex)}
                    row={rowIndex}
                    col={colIndex}
                    onPress={handleCellPress}
                  />
                ))}
              </View>
            ))}
          </View>
        </Animated.View>


       <View
       style={styles.hintText}
       />

        {/* Number Pad */}
        <NumberPad
          onNumberPress={handleNumberPress}
          onClear={handleClearCell}
          disabled={!selectedCell || isSolved || isLoading}
        />

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.resetButton, isLoading && styles.buttonDisabled]}
            onPress={resetPuzzle}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>🔄 Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.newGameButton, isLoading && styles.buttonDisabled]}
            onPress={() => loadGame(difficulty, false)}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>🎲 New Game</Text>
          </TouchableOpacity>
        </View>

        {/* Rules */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>📖 Sudoku Rules</Text>
          <Text style={styles.rulesText}>
            1️⃣ Cells mein 1-9 bharo{'\n'}
            2️⃣ Row mein repeat nahi{'\n'}
            3️⃣ Column mein repeat nahi{'\n'}
            4️⃣ 3×3 box mein repeat nahi{'\n'}
            5️⃣ Red = Galat entry
          </Text>
        </View>
      </ScrollView>

      {/* Victory Modal */}
      <VictoryModal
        visible={isSolved}
        moves={moves}
        time={formatTime(seconds)}
        onNewGame={() => loadGame(difficulty, false)}
      />
    </SafeAreaView>
  );
}


// ================================================================
// PART 10: STYLES
// ================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 50,
  },

  // Header
  header: {
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
  },

  // Difficulty
  difficultyContainer: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 5,
    marginBottom: 18,
  },
  difficultyButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  difficultyButtonDisabled: {
    opacity: 0.6,
  },
  difficultyText: {
    color: '#94A3B8',
    fontWeight: '600',
    fontSize: 13,
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },

  // Stats
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: GRID_SIZE,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  statsItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statsIcon: {
    fontSize: 15,
    marginRight: 6,
  },
  statsText: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
  },

  // Grid
  gridWrapper: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 12,
  },
  gridBorder: {
    borderWidth: 2.5,
    borderColor: '#1E3A5F',
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  gridRow: {
    flexDirection: 'row',
  },

  // Cell
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: CELL_SIZE * 0.48,
    fontWeight: '600',
  },
  initialCellText: {
    fontWeight: '800',
  },

  // Hint
  hintText: {
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 12,
  },

  // Number Pad
  numberPadContainer: {
    alignItems: 'center',
  },
  numberPadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: GRID_SIZE,
    gap: 10,
  },
  numberButton: {
    width: (GRID_SIZE - 60) / 5,
    height: (GRID_SIZE - 60) / 5,
    backgroundColor: '#3B82F6',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  numberButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },
  numberButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  numberButtonTextDisabled: {
    color: '#94A3B8',
  },
  clearButton: {
    marginTop: 14,
    paddingHorizontal: 45,
    paddingVertical: 14,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  clearButtonDisabled: {
    backgroundColor: '#475569',
    shadowOpacity: 0,
    elevation: 0,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Action Buttons
  actionButtonsRow: {
    flexDirection: 'row',
    marginTop: 22,
    gap: 14,
  },
  resetButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  newGameButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
    backgroundColor: '#10B981',
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  // Rules
  rulesBox: {
    marginTop: 25,
    padding: 18,
    backgroundColor: '#1E293B',
    borderRadius: 14,
    width: GRID_SIZE,
  },
  rulesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  rulesText: {
    fontSize: 13,
    color: '#94A3B8',
    lineHeight: 22,
  },

  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '85%',
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  trophyEmoji: {
    fontSize: 75,
    marginBottom: 12,
  },
  congratsTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  congratsSubtitle: {
    fontSize: 17,
    color: '#10B981',
    marginTop: 5,
    marginBottom: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 26,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3B82F6',
  },
  statLabel: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 4,
  },
  statDivider: {
    width: 2,
    height: 38,
    backgroundColor: '#475569',
  },
  playAgainButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 38,
    paddingVertical: 16,
    borderRadius: 14,
  },
  playAgainButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


export default App;