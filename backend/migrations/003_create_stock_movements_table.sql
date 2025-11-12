-- Create stock_movements table for inventory tracking
CREATE TABLE IF NOT EXISTS stock_movements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  warehouse_id INT DEFAULT NULL,
  movement_type ENUM('IN','OUT','ADJUSTMENT') NOT NULL COMMENT 'IN: incoming stock, OUT: outgoing, ADJUSTMENT: manual adjustment',
  reference VARCHAR(50) COMMENT 'Purchase order, sales order, or adjustment reference',
  description VARCHAR(255),
  quantity DECIMAL(12,2) NOT NULL COMMENT 'Positive for IN/ADJUSTMENT increases, negative for OUT/ADJUSTMENT decreases',
  unit_cost DECIMAL(12,2) DEFAULT 0.00 COMMENT 'Cost per unit at time of movement',
  total_cost DECIMAL(12,2) GENERATED ALWAYS AS (quantity * unit_cost) STORED COMMENT 'Automatically calculated total cost',
  movement_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  related_journal_id INT DEFAULT NULL COMMENT 'Links to journal_entries table for accounting records',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  INDEX idx_product_id (product_id),
  INDEX idx_movement_type (movement_type),
  INDEX idx_movement_date (movement_date),
  INDEX idx_related_journal_id (related_journal_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add quantity_on_hand column to products if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS quantity_on_hand DECIMAL(12,2) DEFAULT 0.00 AFTER track_inventory;
