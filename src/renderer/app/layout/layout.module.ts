import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { LayoutRouting } from './layout.routing';
import { LayoutComponent } from './layout.component';
import { HeaderComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgZorroAntdModule } from '@renderer/app/ng-zorro-antd.module';
import { BasicService } from '@renderer/services/system/basic.service';
import { MarkdownModule } from 'ngx-markdown';
import { DatasourceService } from '@renderer/services/management/datasource.service';
import { HttpService } from '@renderer/services/http.service';
import { SshService } from '@renderer/services/ssh.service';
import { PrestoService } from "@renderer/services/presto.service";
import { FactoryService } from "@renderer/services/factory.service";
import { MySQLService } from "@renderer/services/plugin/mysql.service";
import { PostgresqlService } from "@renderer/services/plugin/postgresql.service";
import { PluginFactory } from "@renderer/factory/plugin.factory";
import { PluginToken } from "@renderer/token/plugin.token";
import { ClickHousePlugin } from "@renderer/plugin/clickhouse.plugin";
import { ElasticsearchPlugin } from "@renderer/plugin/elasticsearch.plugin";
import { MysqlPlugin } from "@renderer/plugin/mysql.plugin";
import { ConfigFactory } from "@renderer/factory/config.factory";
import { ConfigToken } from "@renderer/token/config.token";
import { MysqlConfig } from "@renderer/config/mysql.config";
import { ClickHouseConfig } from "@renderer/config/clickhouse.config";
import { PostgreSQLConfig } from "@renderer/config/postgresql.config";
import { PostgreSQLPlugin } from "@renderer/plugin/postgresql.plugin";
import { BuilderFactory } from "@renderer/factory/builder.factory";
import { BuilderToken } from "@renderer/token/builder.token";
import { ClickhouseBuilder } from "@renderer/builder/clickhouse.builder";

const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>
  new TranslateHttpLoader(http, './renderer/assets/i18n/', '.json');

@NgModule({
  declarations: [
    LayoutComponent,
    HeaderComponent
  ],
  imports: [
    LayoutRouting,
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    MarkdownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    BasicService,
    DatasourceService,
    HttpService,
    SshService,
    PrestoService,
    FactoryService,
    MySQLService,
    PostgresqlService,
    /* Plugin */
    PluginFactory,
    {provide: PluginToken, useClass: ClickHousePlugin, multi: true},
    {provide: PluginToken, useClass: ElasticsearchPlugin, multi: true},
    {provide: PluginToken, useClass: MysqlPlugin, multi: true},
    {provide: PluginToken, useClass: PostgreSQLPlugin, multi: true},
    /* Config */
    ConfigFactory,
    {provide: ConfigToken, useClass: ClickHouseConfig, multi: true},
    {provide: ConfigToken, useClass: MysqlConfig, multi: true},
    {provide: ConfigToken, useClass: PostgreSQLConfig, multi: true},
    /* Builder */
    BuilderFactory,
    {provide: BuilderToken, useClass: ClickhouseBuilder, multi: true}
  ]
})
export class LayoutModule {
}
