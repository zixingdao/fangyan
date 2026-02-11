import { Injectable } from '@nestjs/common';
import * as si from 'systeminformation';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class MonitorService {
  private startTime: number = Date.now();
  private requestCount: number = 0;
  private errorCount: number = 0;

  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  incrementRequestCount() {
    this.requestCount++;
  }

  incrementErrorCount() {
    this.errorCount++;
  }

  async getServerStats() {
    // 串行获取，避免同时执行太重的任务导致系统过载
    const cpu = await si.cpu();
    const mem = await si.mem();
    const currentLoad = await si.currentLoad();
    const disk = await si.fsSize();
    
    // 网络统计可能比较慢，加个简单的超时或容错
    let networkStats = [];
    let networkConnections = [];
    try {
        networkStats = await si.networkStats();
        networkConnections = await si.networkConnections();
    } catch (e) {
        // ignore network stats errors
    }

    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    const processMemory = process.memoryUsage();
    
    // Check Database Status
    let dbStatus = 'disconnected';
    try {
      if (this.dataSource.isInitialized) {
        await this.dataSource.query('SELECT 1');
        dbStatus = 'connected';
      }
    } catch (e) {
      dbStatus = 'error';
    }

    return {
      uptime,
      requestCount: this.requestCount,
      errorCount: this.errorCount,
      process: {
        memory: {
          rss: processMemory.rss,
          heapTotal: processMemory.heapTotal,
          heapUsed: processMemory.heapUsed,
        },
        uptime: process.uptime(),
      },
      database: {
        status: dbStatus,
        type: this.dataSource.options.type,
      },
      network: {
        interfaces: networkStats
          .filter(iface => iface.operstate !== 'down') // 只返回非内部且状态正常的网卡
          .map(iface => ({
          iface: iface.iface,
          rx_bytes: iface.rx_bytes || 0,
          tx_bytes: iface.tx_bytes || 0,
          rx_sec: iface.rx_sec || 0,
          tx_sec: iface.tx_sec || 0,
        })),
        connections: {
          total: networkConnections.length,
          established: networkConnections.filter(c => c.state === 'ESTABLISHED').length,
        },
      },
      cpu: {
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        cores: cpu.cores,
        load: Math.round(currentLoad.currentLoad),
      },
      memory: {
        total: mem.total,
        free: mem.free,
        used: mem.used,
        active: mem.active,
        available: mem.available,
      },
      disk: disk.map(d => ({
        fs: d.fs,
        type: d.type,
        size: d.size,
        used: d.used,
        use: d.use,
        mount: d.mount,
      })),
      os: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
      }
    };
  }
}