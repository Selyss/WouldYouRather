import json
import sys
from collections import Counter
from pathlib import Path

def extract_categories(filename):
    categories = []
    
    # Check if file exists
    if not Path(filename).exists():
        print(f"Error: File '{filename}' not found.")
        return []
    
    with open(filename, 'r', encoding='utf-8') as file:
        for line_num, line in enumerate(file, 1):
            try:
                data = json.loads(line.strip())
                if 'category' in data:
                    categories.append(data['category'])
            except json.JSONDecodeError:
                print(f"Warning: Invalid JSON on line {line_num}")
                continue
    
    return categories

def main():
    # Check if filename is provided as command line argument
    if len(sys.argv) > 1:
        filename = sys.argv[1]
    else:
        # Default filename or prompt for input
        filename = input("Enter the path to your JSONL file: ").strip()
        if not filename:
            filename = 'wyr_two_responses.jsonl'  # Default fallback
    
    print(f"Processing file: {filename}")
    print("-" * 50)
    
    # Extract categories
    categories = extract_categories(filename)
    
    if not categories:
        print("No categories found or file could not be processed.")
        return
    
    # Get unique categories
    unique_categories = list(set(categories))
    print("Unique categories:")
    for category in sorted(unique_categories):
        print(f"- {category}")
    
    # Count occurrences
    category_counts = Counter(categories)
    print(f"\nTotal entries: {len(categories)}")
    print(f"Unique categories: {len(unique_categories)}")
    print("\nCategory counts:")
    for category, count in category_counts.most_common():
        print(f"{category}: {count}")

if __name__ == "__main__":
    main()