public class CacheHostedService : IHostedService, IDisposable
{
    private readonly ICacheService _cacheService;
    private readonly MongoDbService _mongoDbService;
    private Timer _timer;

    public CacheHostedService(ICacheService cacheService, MongoDbService mongoDbService)
    {
        _cacheService = cacheService;
        _mongoDbService = mongoDbService;
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        // Update cache every 5 minutes
        _timer = new Timer(UpdateCache, null, TimeSpan.Zero, TimeSpan.FromMinutes(5));
        return Task.CompletedTask;
    }

    private async void UpdateCache(object state)
    {
        var items = await _mongoDbService.GetAllItemsAsync();
        foreach (var item in items)
        {
            _cacheService.SetItem(item.Id, item);
        }
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        _timer?.Change(Timeout.Infinite, 0);
        return Task.CompletedTask;
    }

    public void Dispose()
    {
        _timer?.Dispose();
    }
}