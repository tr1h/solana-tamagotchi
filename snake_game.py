import pygame
import random
import sys

# Инициализация Pygame
pygame.init()

# Константы
WIDTH, HEIGHT = 600, 600
GRID_SIZE = 20
GRID_WIDTH = WIDTH // GRID_SIZE
GRID_HEIGHT = HEIGHT // GRID_SIZE

# Цвета
BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
DARK_GREEN = (0, 200, 0)
BLUE = (0, 100, 255)

# Направления
UP = (0, -1)
DOWN = (0, 1)
LEFT = (-1, 0)
RIGHT = (1, 0)

class Snake:
    def __init__(self):
        self.length = 3
        self.positions = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = random.choice([UP, DOWN, LEFT, RIGHT])
        self.color = GREEN
        self.head_color = DARK_GREEN
        
    def get_head_position(self):
        return self.positions[0]
    
    def update(self):
        cur = self.get_head_position()
        x, y = self.direction
        new = ((cur[0] + x) % GRID_WIDTH, (cur[1] + y) % GRID_HEIGHT)
        
        if len(self.positions) > 2 and new in self.positions[2:]:
            return False
        else:
            self.positions.insert(0, new)
            if len(self.positions) > self.length:
                self.positions.pop()
        return True
    
    def reset(self):
        self.length = 3
        self.positions = [(GRID_WIDTH // 2, GRID_HEIGHT // 2)]
        self.direction = random.choice([UP, DOWN, LEFT, RIGHT])
    
    def render(self, surface):
        for i, p in enumerate(self.positions):
            r = pygame.Rect((p[0] * GRID_SIZE, p[1] * GRID_SIZE), (GRID_SIZE, GRID_SIZE))
            if i == 0:
                pygame.draw.rect(surface, self.head_color, r)
                pygame.draw.rect(surface, DARK_GREEN, r, 1)
            else:
                pygame.draw.rect(surface, self.color, r)
                pygame.draw.rect(surface, DARK_GREEN, r, 1)

class Food:
    def __init__(self):
        self.position = (0, 0)
        self.color = RED
        self.randomize_position()
    
    def randomize_position(self):
        self.position = (random.randint(0, GRID_WIDTH - 1), random.randint(0, GRID_HEIGHT - 1))
    
    def render(self, surface):
        r = pygame.Rect((self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE), 
                       (GRID_SIZE, GRID_SIZE))
        pygame.draw.rect(surface, self.color, r)
        pygame.draw.rect(surface, WHITE, r, 1)

def main():
    # Настройка окна
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption('Змейка')
    
    clock = pygame.time.Clock()
    
    # Создание объектов
    snake = Snake()
    food = Food()
    
    # Счет
    score = 0
    font = pygame.font.Font(None, 36)
    
    game_over = False
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if game_over:
                    if event.key == pygame.K_SPACE:
                        snake.reset()
                        food.randomize_position()
                        score = 0
                        game_over = False
                else:
                    if event.key == pygame.K_UP and snake.direction != DOWN:
                        snake.direction = UP
                    elif event.key == pygame.K_DOWN and snake.direction != UP:
                        snake.direction = DOWN
                    elif event.key == pygame.K_LEFT and snake.direction != RIGHT:
                        snake.direction = LEFT
                    elif event.key == pygame.K_RIGHT and snake.direction != LEFT:
                        snake.direction = RIGHT
        
        if not game_over:
            # Обновление змейки
            if not snake.update():
                game_over = True
            
            # Проверка на съедение еды
            if snake.get_head_position() == food.position:
                snake.length += 1
                score += 10
                food.randomize_position()
                # Проверка, чтобы еда не появилась на змейке
                while food.position in snake.positions:
                    food.randomize_position()
        
        # Отрисовка
        screen.fill(BLACK)
        snake.render(screen)
        food.render(screen)
        
        # Отображение счета
        score_text = font.render(f'Счет: {score}', True, WHITE)
        screen.blit(score_text, (10, 10))
        
        # Отображение game over
        if game_over:
            game_over_text = font.render('ИГРА ОКОНЧЕНА!', True, RED)
            restart_text = font.render('Нажмите ПРОБЕЛ', True, WHITE)
            screen.blit(game_over_text, (WIDTH // 2 - 150, HEIGHT // 2 - 50))
            screen.blit(restart_text, (WIDTH // 2 - 140, HEIGHT // 2))
        
        pygame.display.update()
        clock.tick(10)

if __name__ == '__main__':
    main()
