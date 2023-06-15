<?php

namespace App\Command;

use App\Controller\GameController;
use App\Repository\GameRepository;
use DateTime;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'game-end-at',
    description: 'Add a short description for your command',
)]
class GameEndAtCommand extends Command
{
        
    private GameRepository $gameRepository;
    private GameController $gameController;
    
    public function __construct(GameController $gameController,GameRepository $gameRepository)
    {
        parent::__construct();
        $this->gameRepository = $gameRepository;
        $this->gameController = $gameController;

    }
    protected function configure(): void
    {
        $this
            ->addArgument('arg1', InputArgument::OPTIONAL, 'Argument description')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $game = $this->gameRepository->findOneBy([], ['id' => 'ASC']);

        $minutes = '+ ' . $game->getLimitTime() . ' minutes';
        if ($game->getStartAt()) {

            $endAt = new DateTime();
            $endAt->modify($minutes);


            while (new DateTime() < $endAt) {
            }
            $this->gameController->end();
            return Command::SUCCESS;
        }
        return Command::FAILURE;
    }
}
