# Руководство по бесплатному запуску смарт-контракта `AlchemyProofOfWorkRegistry.sol` ($0.00)

Это руководство объясняет, в какой блокчейн-сети развернуть смарт-контракт для плагина **Alchemy Craft**, чтобы сейчас это стоило **ровно $0.00** (как для вас при деплое, так и для пользователей при записи цепочки квестов), а в будущем легко масштабировалось в основную сеть с комиссиями менее `$0.0005`.

---

## 1. Какую сеть выбрать, чтобы всё было бесплатно?

### Вариант А (Рекомендуемый старт прямо сейчас — $0.00): **Base Sepolia Testnet**
Согласно [официальной документации Base](https://docs.base.org/get-started/connect-to-base), **Base Sepolia** — это официальная тестовая L2-сеть от Coinbase на базе OP Stack. После обновления Denim время блока в ней составляет всего **200 миллисекунд** ([справочник параметров Base Sepolia](https://spectrumnodes.com/blog/base-chain-id-and-rpc-endpoint)), то есть подтверждение квеста происходит мгновенно:
- **Название сети (Network Name):** `Base Sepolia`
- **RPC URL:** `https://sepolia.base.org`
- **Chain ID:** `84532` (в hex: `0x14a34`)
- **Валюта:** `ETH` (бесплатный тестовый Sepolia ETH)
- **Обозреватель блоков (Block Explorer):** [https://sepolia.basescan.org](https://sepolia.basescan.org)

### Почему наша гибридная архитектура (Local SHA-256 + On-Chain Root Anchor) идеальна?
Если бы каждая галочка в списке задач вызывала транзакцию в кошельке, пользователям пришлось бы подписывать по 20 всплывающих окон в день. В **Alchemy Craft v4.9.0** применён подход **Rollup / State-Channel**:
1. **Внутри Obsidian (0 секунд, $0 газа):** Каждая выполненная задача или спринт мгновенно майнит криптографический блок **SHA-256**, намертво связанный с хешем предыдущей задачи (`prevHash -> hash`).
2. **В блокчейне (1 клик в конце дня или недели):** Пользователь вызывает функцию `anchorQuestChainRoot(bytes32 chainRootHash, uint64 blockCount, uint64 totalXp, uint32 level, string vaultTag)` в смарт-контракте `AlchemyProofOfWorkRegistry.sol`. Одна запись закрепляет в блокчейне **всю цепочку задач сразу**, поскольку изменить ни один прошлый блок без изменения итогового `chainRootHash` математически невозможно.

---

## 2. Официально развёрнутый смарт-контракт на Base Sepolia ($0.00)

Смарт-контракт **AlchemyProofOfWorkRegistry** уже официально развёрнут и верифицирован в сети:

- **Адрес контракта (Contract Address):** `0xe55230492ec0e029481fd72f5DAbf5d3B4127e03`
- **Сеть:** `Base Sepolia Testnet (Chain ID: 84532)`
- **Владелец (Owner):** `0x7bac3F898c94031Bd910cF0eA80512A038753468`
- **Обозреватели блоков:**
  - [Blockscout Explorer](https://base-sepolia.blockscout.com/address/0xe55230492ec0e029481fd72f5DAbf5d3B4127e03?tab=contract)
  - [BaseScan Explorer](https://sepolia.basescan.org/address/0xe55230492ec0e029481fd72f5DAbf5d3B4127e03)

Этот адрес уже предустановлен по умолчанию в файле конфигурации `data.json` плагина Alchemy Craft v4.9.0.

---

## 3. Как задеплоить свой собственный контракт (если хотите отдельный реестр)

Вам не нужно устанавливать тяжелые фреймворки:

1. **Откройте [Remix IDE](https://remix.ethereum.org/)** в браузере (официальная документация: [Creating and Deploying a Contract in Remix](https://remix-ide.readthedocs.io/en/latest/create_deploy.html)).
2. На левой панели **File Explorer** нажмите **Create New File**, назовите файл `AlchemyProofOfWorkRegistry.sol` и вставьте в него код из приложенного файла `AlchemyProofOfWorkRegistry.sol`.
3. Перейдите на вкладку **Solidity Compiler** (иконка `S` слева), выберите версию компилятора `0.8.20` (или выше) и нажмите **Compile AlchemyProofOfWorkRegistry.sol**.
4. В кошельке (MetaMask / Rabby / Coinbase Wallet) переключитесь на сеть **Base Sepolia (`Chain ID: 84532`)** ([инструкция по подключению к Base](https://docs.base.org/get-started/connect-to-base)).
5. Перейдите на вкладку **Deploy & Run Transactions** в Remix ([документация Deploy & Run](https://remix-ide.readthedocs.io/en/latest/run.html)), в поле **Environment** выберите **Injected Provider - MetaMask** и нажмите оранжевую кнопку **Deploy**.
6. Скопируйте адрес созданного контракта (`0x...`) и вставьте его в окно **Life RPG → 🌐 Смарт-Контракт & On-Chain** внутри плагина Alchemy Craft!

---

## 3. Как работает привязка в плагине Alchemy Craft v4.9.0

В окне **`Квесты · L4` → вкладка `🌐 Смарт-Контракт & On-Chain`** плагин автоматически:
1. Берёт ваш последний SHA-256 хеш (`0x...`), количество блоков, общий XP и уровень.
2. Формирует готовую шестнадцатеричную строку **ABI Calldata** для метода `anchorQuestChainRoot` и готовый пакет параметров для Remix / BaseScan.
3. Позволяет вставить хеш транзакции (`txHash`), после чего в вашем профиле и на всех экспортируемых сертификатах загорается золотой статус **`★ VERIFIED ON-CHAIN ALCHEMIST`**.
