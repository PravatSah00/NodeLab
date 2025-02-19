/**
 * -------------------------------------------------------------------------------------------------------------
 * NOTE: Helper class for cache data
 * 
 * AUTHOR: pravats459@gmail.com
 * VERSION: 1.0.0
 * -------------------------------------------------------------------------------------------------------------
 */

/**
 * Define Store chunk type. it represent as single data element.
 */
interface StoreChunk<T> {
    createdAt: number,
    value:      T,
}

/**
 * Define CacheMandler class responsible for managing cashe data
 */
class CacheHandler<T> {

    /**
     * Define cache store, store actual data
     */
    protected store: Map<string, StoreChunk<T>> = new Map();

    /**
     * Set a entry in store
     */
    public set( key: string, value: T ) {
        this.store.set(
            key,
            {
                createdAt: Date.now(),
                value:     value,
            }
        )
    }

    /**
     * Get a entry from store
     */
    public get( key: string, defaultValue: T | undefined ) {

        const data = this.store.get( key );
    
        if ( data === undefined ) return defaultValue;

        return data.value;
    }

    /**
     * Delete a entry from store
     */
    public delete( key: string ) {
        this.store.delete( key );
    }

    /**
     * Clear all entry from store
     */
    public clear() {
        this.store.clear();
    }
}

export default CacheHandler;
