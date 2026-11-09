package org.nofre.back_office_api.spring_configs

import org.springframework.beans.factory.annotation.Configurable
import org.springframework.cache.CacheManager
import org.springframework.cache.annotation.EnableCaching
import org.springframework.cache.concurrent.ConcurrentMapCacheManager
import org.springframework.context.annotation.Bean

@EnableCaching
@Configurable
class SpringCacheConfig {

    @Bean
    fun cacheManager(): CacheManager {
        return ConcurrentMapCacheManager()
    }
}