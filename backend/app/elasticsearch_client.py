from elasticsearch import Elasticsearch
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Initialize Elasticsearch client
es = Elasticsearch(
    [settings.ELASTICSEARCH_HOST],
    request_timeout=30,
    max_retries=10,
    retry_on_timeout=True
)


async def create_index_if_not_exists():
    """Create the OSINT data index with proper mapping if it doesn't exist."""
    index_name = settings.ELASTICSEARCH_INDEX
    
    if not es.indices.exists(index=index_name):
        mapping = {
            "mappings": {
                "properties": {
                    "type": {"type": "keyword"},
                    "value": {"type": "text", "analyzer": "standard"},
                    "source": {"type": "keyword"},
                    "additional_info": {"type": "text"},
                    "indexed_at": {"type": "date"}
                }
            },
            "settings": {
                "number_of_shards": 1,
                "number_of_replicas": 1
            }
        }
        
        try:
            es.indices.create(index=index_name, body=mapping)
            logger.info(f"Created Elasticsearch index: {index_name}")
        except Exception as e:
            logger.error(f"Error creating index: {e}")
            raise
    else:
        logger.info(f"Index {index_name} already exists")


async def bulk_index_data(documents: list):
    """Bulk index documents to Elasticsearch."""
    if not documents:
        return
    
    actions = []
    for doc in documents:
        action = {
            "_index": settings.ELASTICSEARCH_INDEX,
            "_source": doc
        }
        actions.append(action)
    
    try:
        from elasticsearch.helpers import bulk
        success, failed = bulk(es, actions, chunk_size=10000, request_timeout=60)
        logger.info(f"Bulk indexed {success} documents, failed: {failed}")
        return success, failed
    except Exception as e:
        logger.error(f"Error bulk indexing: {e}")
        raise


async def search_data(query: str, data_type: str = None, size: int = 100):
    """Search the Elasticsearch index with optional type filter."""
    search_query = {
        "query": {
            "bool": {
                "should": [
                    {"match_phrase": {"value": query}},
                    {"wildcard": {"value": f"*{query}*"}},
                    {"fuzzy": {"value": {"value": query, "fuzziness": 2}}}
                ],
                "minimum_should_match": 1
            }
        },
        "size": size
    }
    
    # Add type filter if specified
    if data_type:
        search_query["query"]["bool"]["filter"] = [{"term": {"type": data_type}}]
    
    try:
        response = es.search(index=settings.ELASTICSEARCH_INDEX, body=search_query)
        results = []
        
        for hit in response["hits"]["hits"]:
            results.append({
                "type": hit["_source"]["type"],
                "value": hit["_source"]["value"],
                "source": hit["_source"].get("source", ""),
                "additional_info": hit["_source"].get("additional_info", ""),
                "score": hit["_score"]
            })
        
        # Group results by type
        grouped_results = {}
        for result in results:
            dtype = result["type"]
            if dtype not in grouped_results:
                grouped_results[dtype] = []
            grouped_results[dtype].append(result)
        
        return grouped_results
    except Exception as e:
        logger.error(f"Search error: {e}")
        raise


async def get_index_stats():
    """Get statistics about the Elasticsearch index."""
    try:
        stats = es.indices.stats(index=settings.ELASTICSEARCH_INDEX)
        return {
            "total_documents": stats["indices"][settings.ELASTICSEARCH_INDEX]["total"]["docs"]["count"]
        }
    except Exception as e:
        logger.error(f"Error getting stats: {e}")
        return {}
