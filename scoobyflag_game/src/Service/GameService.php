<?php

namespace App\Service;

use App\Entity\Game;
use App\Entity\GameInterdictionLocalisation;
use App\Entity\GameLocation;
use App\Entity\Item;
use App\Entity\Location;
use App\Entity\Objective;
use App\Entity\Team;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\UserRepository;
use App\Entity\User;
use App\Repository\ItemRepository;
use App\Repository\ObjectiveRepository;
use App\Repository\TeamRepository;
use Symfony\Component\Dotenv\Dotenv;
use Symfony\Component\HttpClient\HttpClient;
use Symfony\Component\Serializer\SerializerInterface;

class GameService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private ItemRepository $itemRepository;
    private ObjectiveRepository $objectiveRepository;
    private TeamRepository $teamRepository;

    public function __construct(TeamRepository $teamRepository, ObjectiveRepository $objectiveRepository, ItemRepository $itemRepository, EntityManagerInterface $em, UserRepository $userRepository)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->itemRepository = $itemRepository;
        $this->objectiveRepository = $objectiveRepository;
        $this->teamRepository = $teamRepository;
    }

    public function importGame()
    {

        $dotenv = new Dotenv();
        $dotenv->load(__DIR__ . '/../../.env');
    
        $id = $_ENV['ID'];
        $url = 'https://scoobyhunt.fr/game/gameTemplate/' . $id;

        $client = HttpClient::create();
        $response = $client->request('GET', $url);
    
        $content = $response->toArray();
    
        $this->importGameSetting($content['gameTemplate']['json']);
    }
    public function importGameSetting($data)
    {
        dump($data);
        $game = new Game();
        $game->setLimitTime($data['limitTime']);
        $game->setName($data['name']);
        $game->setMode($data['modeDeJeu']);
        $this->em->persist($game);

        $zone = [];
        foreach ($data['authorizedZone'] as $zone) {
            $newZone = new GameLocation();
            $game->addGameLocation($newZone);
            $newZone->setLatitude($zone['latitude']);
            $newZone->setLongitude($zone['longitude']);
            $zone[] = $newZone;

            $this->em->persist($newZone);
        }

        foreach ($data['unauthorizedZone'] as $zone) {
            $newZone = new GameInterdictionLocalisation();
            $game->addGameInterdictionLocalisation($newZone);
            foreach ($zone as $location) {
                $newLocation = new Location();
                $newLocation->setLatitude($location['latitude']);
                $newLocation->setLongitude($location['longitude']);
                $newLocation->setLocalisation($newZone);
                $this->em->persist($newLocation);
            }
            $nopZone[] = $newZone;
            $this->em->persist($newZone);
        }
        $items = [];
        foreach ($data['items'] as $item) {
            $newItem = new Item();
            $game->addItem($newItem);
            $newItem->setLatitude($item['latitude']);
            $newItem->setLongitude($item['longitude']);
            $newItem->setQuantity(3);
            $newItem->setType($item['name']);
            $items[] = $newItem;
            $this->em->persist($newItem);
        }
        $objectives = [];
        foreach ($data['mechants'] as $objective) {
            $newObjective = new Objective();
            $game->addObjective($newObjective);
            $newObjective->setLatitude($objective['latitude']);
            $newObjective->setLongitude($objective['longitude']);
            $objectives[] = $newObjective;
            $this->em->persist($newObjective);
        }
        $teams = [];
        foreach ($data['teams'] as $team) {
            $newTeam = new Team();
            $newTeam->setNbPlayer($team['nbJoueur']);
            $newTeam->setName($team['nom']);
            $teams[] = $newTeam;
            $game->addTeam($newTeam);
            $this->em->persist($newTeam);
        }
        $this->em->flush();
        dump($game);
        return $game;
    }

    public function stat()
    {

        $teams = $this->teamRepository->findAll();

        $data = [];

        foreach ($teams as $team) {
            $players = $team->getPlayers();
            $nbObjectives = 0;
            $playersScore = [];
            foreach ($players as $player) {
                $nbObjectives += count($player->getObjectives());
                $playersScore[] = ['pseudo' => $player->getPseudo(), 'id' => $player->getId(), 'score' => count($player->getObjectives()) ?? 0];
            }
            $data[] = [
                'team' => $team->getName(),
                'nbObjectives' => $nbObjectives,
                'playersScore' => $playersScore
            ];
        }
        return $data;
    }

    public function save($entity)
    {
        $this->em->persist($entity);
        $this->em->flush($entity);
    }
}
