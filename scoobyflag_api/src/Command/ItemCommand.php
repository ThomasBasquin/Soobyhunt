<?php

namespace App\Command;

use App\Entity\User;
use App\Service\ItemService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class ItemCommand extends Command
{

    protected $em;
    protected static $defaultName = 'app:createItem';
    protected static $defaultDescription = 'Crée tous les items du jeu.';
    private ItemService $itemService;

    public function __construct(ItemService $itemService)
    {
        parent::__construct();
        $this->itemService = $itemService;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $this->itemService->createAll();
        return Command::SUCCESS;
    }
}
