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
use Symfony\Component\Serializer\SerializerInterface;

class GameService
{
    public EntityManagerInterface $em;
    private UserRepository $userRepository;
    private ItemRepository $itemRepository;
    private ObjectiveRepository $objectiveRepository;

    public function __construct(ObjectiveRepository $objectiveRepository, ItemRepository $itemRepository, EntityManagerInterface $em, UserRepository $userRepository)
    {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->itemRepository = $itemRepository;
        $this->objectiveRepository = $objectiveRepository;
    }

    public function importGameSetting($data)
    {
        $game = new Game();
        $game->setLimitTime($data['limitTime']);
        $game->setName($data['name']);
        $game->setMode($data['modeDeJeu']);
        $this->em->persist($game);
        $this->em->flush($game);

        $zone = [];
        foreach ($data['authorizedZone'] as $zone) {
            # code...
            $newZone = new GameLocation();
            $newZone->setGame($game);
            $newZone->setLatitude($zone['lat']);
            $newZone->setLongitude($zone['lng']);
            $zone[] = $newZone;

            $this->em->persist($newZone);
        }

        foreach ($data['unauthorizedZone'] as $zone) {
            $newZone = new GameInterdictionLocalisation();
            $newZone->setGame($game);
            foreach ($zone as $location) {
                $newLocation = new Location();
                $newLocation->setLatitude($location['lat']);
                $newLocation->setLongitude($location['lng']);
                $newLocation->setLocalisation($newZone);
                $this->em->persist($newLocation);
            }
            $nopZone[] = $newZone;
            $this->em->persist($newZone);
        }
        $items = [];
        foreach ($data['items'] as $item) {
            # code...
            $newItem = new Item();
            $newItem->setGame($game);
            $newItem->setLatitude($item['coordonnees']['lat']);
            $newItem->setLongitude($item['coordonnees']['lng']);
            $newItem->setQuantity(3);
            $newItem->setType($item['name']);
            $items[] = $newItem;
            $this->em->persist($newItem);
        }
        $objectives = [];
        foreach ($data['mechants'] as $objective) {
            $newObjective = new Objective();
            $newObjective->setGame($game);
            $newObjective->setLatitude($objective['lat']);
            $newObjective->setLongitude($objective['lng']);
            $objectives[] = $newObjective;
            $this->em->persist($newObjective);
        }
        $teams = [];
        foreach ($data['teams'] as $team) {
            $newTeam = new Team();
            $newTeam->setGame($game);
            $newTeam->setNbPlayer($team['nbJoueur']);
            $newTeam->setName($team['nom']);
            $teams[] = $newTeam;
            $this->em->persist($newTeam);
        }
        $this->em->flush();
        return $game;
    }

    public function save($entity)
    {
        $this->em->persist($entity);
        $this->em->flush($entity);
    }
}
