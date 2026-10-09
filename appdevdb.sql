SET NAMES utf8mb4;

CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `meal` varchar(255) NOT NULL,
  `amount` varchar(100) NOT NULL,
  `date` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `orders` (`id`, `name`, `meal`, `amount`, `date`) VALUES
(2, 'maybe', 'carbonara', '4', '2026-10-09'),
(3, 'kris', 'carbonara', '2', '2026-10-02'),
(4, 'mae', 'classic', '2', '2026-10-09'),
(5, 'test', 'sunny side', '1', '2026-10-09'),
(6, '7test', 'classic', '21', '2026-10-07'),
(7, 'order100', 'garden', '100', '2026-10-09');

CREATE TABLE `stocks` (
  `stock_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `amount` int NOT NULL,
  PRIMARY KEY (`stock_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `stocks` (`stock_id`, `name`, `amount`) VALUES
(2, 'Meat ( slab )', 130),
(3, 'Rosemary (pack)', 2),
(4, 'Thyme (pack)', 1),
(5, 'Pepper (pack)', 1),
(6, 'Paprika (pack)', 3),
(7, 'Potatoes (P100)', 3),
(8, 'Salt (pack)', 5);

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'steaknbake', 'admin1234');