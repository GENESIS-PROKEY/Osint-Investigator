"""
Excel to Elasticsearch Import Script
Imports OSINT data from Excel files into Elasticsearch index.
"""
import sys
import os
import pandas as pd
import argparse
from datetime import datetime
import asyncio

# Add parent directory to path to import app modules
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app.elasticsearch_client import bulk_index_data
from app.config import settings
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


def validate_dataframe(df):
    """Validate that the DataFrame has the required columns."""
    required_columns = ['type', 'value']
    optional_columns = ['source', 'additional_info']
    
    for col in required_columns:
        if col not in df.columns:
            raise ValueError(f"Missing required column: {col}")
    
    # Add optional columns if missing
    for col in optional_columns:
        if col not in df.columns:
            df[col] = ""
    
    return df


def process_dataframe(df):
    """Process DataFrame and prepare documents for indexing."""
    df = validate_dataframe(df)
    
    documents = []
    for _, row in df.iterrows():
        doc = {
            "type": str(row['type']).lower(),
            "value": str(row['value']),
            "source": str(row.get('source', '')),
            "additional_info": str(row.get('additional_info', '')),
            "indexed_at": datetime.utcnow().isoformat()
        }
        documents.append(doc)
    
    return documents


async def import_from_excel(file_path: str):
    """Import data from Excel file to Elasticsearch."""
    try:
        logger.info(f"Reading Excel file: {file_path}")
        df = pd.read_excel(file_path)
        logger.info(f"Loaded {len(df)} rows from Excel file")
        
        # Process data
        documents = process_dataframe(df)
        logger.info(f"Processed {len(documents)} documents for indexing")
        
        # Bulk index to Elasticsearch
        logger.info("Indexing documents to Elasticsearch...")
        success, failed = await bulk_index_data(documents)
        logger.info(f"Successfully indexed {success} documents, {failed} failed")
        
        return success, failed
    
    except Exception as e:
        logger.error(f"Error importing data: {e}")
        raise


def main():
    parser = argparse.ArgumentParser(description='Import OSINT data from Excel to Elasticsearch')
    parser.add_argument('--file', '-f', required=True, help='Path to Excel file')
    parser.add_argument('--host', help='Elasticsearch host (overrides config)')
    
    args = parser.parse_args()
    
    # Override Elasticsearch host if provided
    if args.host:
        import os
        os.environ['ELASTICSEARCH_HOST'] = args.host
    
    if not os.path.exists(args.file):
        logger.error(f"File not found: {args.file}")
        sys.exit(1)
    
    logger.info("Starting data import...")
    logger.info(f"Elasticsearch host: {settings.ELASTICSEARCH_HOST}")
    logger.info(f"Target index: {settings.ELASTICSEARCH_INDEX}")
    
    try:
        success, failed = asyncio.run(import_from_excel(args.file))
        logger.info(f"Import completed: {success} successful, {failed} failed")
        sys.exit(0 if failed == 0 else 1)
    except Exception as e:
        logger.error(f"Import failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
