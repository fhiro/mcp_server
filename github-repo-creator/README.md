# github-repo-creator

このMCPサーバーは、GitHubリポジトリを作成するためのものです。

## 使い方

1.  このサーバーをModel Context Protocol (MCP) 環境にインストールします。
2.  `GITHUB_TOKEN`と`GITHUB_OWNER`環境変数を設定します。
    *   `GITHUB_TOKEN`は、リポジトリを作成するための権限を持つGitHubパーソナルアクセストークンです。
    *   `GITHUB_OWNER`は、リポジトリを作成するGitHubユーザー名です。
3.  `create_repository`ツールを使用して、リポジトリを作成します。

    例：

    ```
    use_mcp_tool github-repo-creator create_repository '{"repository_name": "新しいリポジトリ名"}'
    ```

## システム構成

このサーバーは、以下の環境変数を使用します。

*   `GITHUB_TOKEN`: GitHub APIへの認証に使用されるパーソナルアクセストークン。
*   `GITHUB_OWNER`: リポジトリを作成するGitHubユーザー名。

## 依存関係

このサーバーは、以下のnpmパッケージに依存しています。

*   @octokit/rest
*   @modelcontextprotocol/sdk

これらの依存関係は、以下のコマンドでインストールできます。

```
npm install
```

## 開発

このサーバーを開発するには、以下の手順に従ってください。

1.  リポジトリをクローンします。
2.  依存関係をインストールします。
3.  コードを変更します。
4.  ビルドします。

```
npm run build
```

## ライセンス

MIT
